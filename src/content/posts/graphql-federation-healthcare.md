---
title: "GraphQL Federation in Healthcare: Lessons from a Real Rollout"
date: "Sep 10, 2024"
category: "Architecture"
description: "How we stitched together a unified GraphQL API across four clinical services — and the edge cases that kept us up at night."
tags: ["GraphQL", "Federation", "Healthcare", "API Design"]
author: "SYS_ARCHITECT"
readingTime: "8 min"
featured: false
---

The promise of GraphQL Federation is clean: each team owns their slice of the schema, a gateway composes the whole, and clients get exactly the data they asked for. The reality in healthcare is a little grittier — because patient data doesn't respect neat service boundaries.

## The starting point

We had four services, each with a REST API that had grown organically over three years:

- **Clinical Notes** — the narrative heart of the EHR.
- **Lab Results** — high-throughput, highly structured.
- **Medications** — pharmacy's domain, heavily regulated.
- **Appointments** — scheduling, simple on the surface, complex in the details.

Clients — a React web app, two native mobile apps, and a handful of integrations — were calling all four independently. The result: N+1 over the network, inconsistent pagination, and a client-side data aggregation layer that was becoming a second backend.

## Why federation, not a monolithic schema

A single GraphQL schema owned by one team would have been simpler to start. It would have become a bottleneck by month three. Federation lets each team ship their `subgraph` independently while the `supergraph` gives clients a single endpoint.

```
Client → Gateway → Clinical Subgraph
                 → Lab Subgraph
                 → Meds Subgraph
                 → Appointments Subgraph
```

The gateway composes the schema at build time, not at runtime. If a subgraph breaks the contract, it fails to compose — which is far better than a runtime surprise in front of a clinician.

## The data graph is not the service graph

This was the first lesson. In federation, you define **entities** — objects with a stable `@key` — that can be resolved across subgraphs.

```graphql
type Patient @key(fields: "id") {
  id: ID!
  name: String!
}

extend type Patient @key(fields: "id") {
  id: ID! @external
  labResults: [LabResult!]!
  medications: [Medication!]!
}
```

The `Patient` type lives in the Clinical subgraph. The Lab and Meds subgraphs **extend** it with their own fields. The gateway stitches them together: a client asks for `patient.labResults.medications` and the gateway fans out to the right subgraphs.

The pitfall: **circular references**. If Clinical extends Patient with `labResults` and Labs extends Patient with `clinicalNotes`, the composition succeeds but the resolution can loop. We caught this in integration testing — but only because we had a synthetic patient with ten thousand lab results.

## Auth at the gateway, policy at the subgraph

Authorization is split in two layers:

1. **Authentication** happens at the gateway. A JWT is validated, and the resulting claims are passed downstream as headers.
2. **Authorization** happens at the subgraph. Each subgraph enforces its own policies — a nurse can see clinical notes but not pharmacy overrides; a pharmacist can see medications but not the full clinical narrative.

```graphql
extend type Patient @key(fields: "id") {
  id: ID! @external
  medications: [Medication!]! @requiresPolicy(action: "read:medications")
}
```

The `@requiresPolicy` directive is a custom federation directive we implemented as a plugin. It checks the JWT claims against a policy engine before resolving the field. If the check fails, the field returns `null` — not an error — because the client should handle missing data gracefully, not crash.

## The subscription problem

GraphQL subscriptions don't compose across subgraphs out of the box. We needed real-time updates for lab results (when a new result arrived, the ordering clinician should see it immediately) and for appointments (when a slot opened up).

The solution was a sidecar: a lightweight service that subscribes to the event bus (Azure Service Bus, same one the microservices use) and exposes a single WebSocket endpoint. The gateway doesn't know about subscriptions; clients connect directly to the sidecar. It's not pure federation, but it's honest.

## What broke in production

1. **Schema drift.** A subgraph shipped a breaking change in a patch release. The composition failed silently in staging because the CI pipeline was checking the old schema file, not the live one. Fix: schema diffing in CI, blocking merges on breaking changes.

2. **Depth limiting.** A client query with eight levels of nesting caused a subgraph to allocate 2GB of memory. Fix: query depth limit of six at the gateway, enforced by a custom plugin.

3. **Field-level caching.** The gateway was caching entire query results, which meant a change in medications could invalidate a cache hit that included lab results. Fix: per-subgraph response caching with TTLs tuned to the domain — lab results cache for five minutes, medications for thirty seconds.

## The shape that survived

A gateway, four subgraphs, a subscription sidecar, and a schema registry. Clients call one endpoint. Each team ships their subgraph on their own schedule. The composition fails loudly if someone breaks the contract.

The schema is the source of truth. Not the code, not the database — the schema. That's the real lesson of federation: the contract is the product.
