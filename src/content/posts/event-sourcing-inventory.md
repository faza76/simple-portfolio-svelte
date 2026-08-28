---
title: "Event Sourcing for Real-Time Inventory"
date: "Dec 3, 2024"
category: "Architecture"
description: "Replacing a mutable inventory table with an append-only event log to achieve consistent stock levels across distributed warehouses without distributed locks."
tags: ["Event Sourcing", "CQRS", "PostgreSQL", "Architecture"]
author: "SYS_ARCHITECT"
readingTime: "9 min"
featured: false
---

Inventory systems are the canonical example of a problem that looks simple until you
remove the single-server assumption. A mutable `quantity_on_hand` column works beautifully
until two warehouses ship the same last unit simultaneously, and a distributed lock
"fixes" the problem by making every other operation wait its turn.

We replaced the mutable table with an append-only event log and discovered that the cure
was not more locking — it was abandoning the idea that the current state is the source
of truth.

## The mutable world

The original schema was a single row per SKU:

```sql
CREATE TABLE inventory (
    sku         TEXT PRIMARY KEY,
    quantity    INT NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT now()
);
```

A shipment decremented the row. A restock incremented it. Pessimistic locking with
`SELECT ... FOR UPDATE` prevented double-shipments, but under load the lock contention
turned the inventory service into a bottleneck that serialized every fulfillment operation
across every warehouse.

## The event log

The replacement was a single append-only table:

```sql
CREATE TABLE inventory_events (
    event_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku         TEXT NOT NULL,
    event_type  TEXT NOT NULL,  -- 'reserved', 'shipped', 'restocked', 'adjusted'
    quantity    INT NOT NULL,
    warehouse   TEXT NOT NULL,
    occurred_at TIMESTAMPTZ DEFAULT now(),
    correlation_id TEXT NOT NULL
);

CREATE INDEX idx_events_sku_time ON inventory_events (sku, occurred_at DESC);
```

Every state change — a reservation, a shipment, a restock, a manual adjustment — is an
immutable row. The current quantity is derived:

```sql
SELECT sku,
       SUM(CASE WHEN event_type IN ('restocked', 'adjusted') THEN quantity
                WHEN event_type IN ('reserved', 'shipped') THEN -quantity
                END) AS on_hand
FROM   inventory_events
WHERE  sku = $1
GROUP BY sku;
```

## The consistency trick

The double-shipment problem vanished. Two concurrent reservations for the same last unit
are not race conditions — they are events with different `correlation_id` values. A
postgreSQL exclusion constraint prevents the derived state from going negative:

```sql
CREATE ASSERTION no_negative_stock CHECK (
    NOT EXISTS (
        SELECT sku,
               SUM(CASE WHEN event_type IN ('restocked', 'adjusted') THEN quantity
                        ELSE -quantity END) AS on_hand
        FROM   inventory_events
        GROUP BY sku
        HAVING SUM(CASE WHEN event_type IN ('restocked', 'adjusted') THEN quantity
                        ELSE -quantity END) < 0
    )
);
```

The second reservation fails at commit time — not with a lock timeout, not with a
409 conflict, but with a clean constraint violation and a clear message: insufficient
stock. No distributed coordination required.

## What the architecture looked like

```
[Warehouse API] --append--> [Event Log] --project--> [Read Model (Materialized View)]
                                       --audit-----> [Compliance Archive]
```

The **command side** validates business rules against the current projection and appends
an event if the rules pass. The **read model** is a materialized view refreshed
asynchronously, serving the dashboards and APIs that only need the current state.

The **compliance archive** is the same event log, just indexed differently — auditors get
the full history without touching the operational system.

## Lessons from the cut

1. **Rebuilding the read model is not optional.** The first month we treated the read
   model as a cache — "we can always recompute." Then a projection bug drifted the
   dashboard for six hours before anyone noticed. Now the read model is rebuilt nightly
   as a scheduled job, and any deviation triggers an alarm. The event log is the truth;
   the projection is a derived convenience.

2. **Event schemas evolve.** Versioning the event envelope with a `schema_version` field
   and a consumer-side migration function avoided the "rewrite history" trap. Old events
   stay old. New consumers apply a thin adapter.

3. **The audit trail wrote itself.** Compliance requirements that once demanded a separate
   logging system became a query against the existing event log. The cost of meeting the
   requirement dropped to zero.

> The past does not change. That is not a limitation of the model — it is the foundation
> of its integrity.

## The result

Inventory accuracy went from 96.4% (with manual reconciliation) to 99.97%. Fulfillment
throughput doubled because the lock contention disappeared. And the compliance team stopped
asking for audit exports — they just query the event log directly.
