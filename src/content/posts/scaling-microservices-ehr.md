---
title: "Scaling Microservices for Clinical EHRs"
date: "Aug 28, 2024"
category: "Architecture"
description: "Architectural considerations when decoupling a monolithic Electronic Health Record system into resilient, independent domains using .NET 8."
tags: ["Microservices", ".NET 8", "Architecture", "HIPAA"]
author: "SYS_ARCHITECT"
readingTime: "7 min"
featured: false
---

A monolithic Electronic Health Record (EHR) is a seductive thing to inherit. It deploys as
a single artifact, it shares one transaction boundary, and it has exactly one schema to
reason about. It is also the reason a bug in the billing module can take down triage.

This post is the field report from the cut — the principles that survived contact with
production, and the ones that quietly turned out to matter more than the whiteboard
suggested.

## Why split at all

The trigger was not scale; it was **blast radius**. A single null-reference in the
notification subsystem took the entire application offline for forty minutes during a
peak admission window. The lesson, written in incident reports:

- Independent failure is worth more than shared efficiency.
- Independent deployment is worth more than coordinated refactors.
- A bounded context is worth more than a shared database.

## Drawing the seams

We followed the patient's journey, not the org chart. Each seam was a domain where the
data and the rules could be owned end-to-end:

| Service | Owns | Does not touch |
| --- | --- | --- |
| `Admissions` | admission lifecycle, bed assignment | billing, clinical notes |
| `Clinical` | notes, orders, results | billing |
| `Pharmacy` | medication, dispensing | clinical narrative |
| `Billing` | claims, remittance | clinical detail |

The temptation to share a `Patients` table was resisted. Instead, `Admissions` owns the
canonical patient record and publishes domain events; the others keep a **read model**
they rebuild from the stream.

## The contracts

Inter-service communication is split by intent:

- **Commands** travel over gRPC, one request, one response, low latency.
- **Events** travel over a bus (Azure Service Bus), at-least-once, idempotent consumers.

```csharp
public record PatientAdmitted(
    Guid PatientId,
    string FullName,
    DateTimeOffset AdmittedAt);
```

Every consumer is idempotent by convention — `PatientId` plus the event's `EventId` is the
natural key in the read-model store, and re-processing an event is a no-op rather than a
duplicate.

## What the whiteboard got wrong

1. **"Microservices reduce coupling."** They relocate it. The coupling moved from the
   database to the event schema — which is fine, but only if you treat that schema with
   the same reverence you once gave the `Patients` table. Version it. Document it. Break
   it deliberately.

2. **"Distributed transactions are tractable."** They are not. We adopted **sagas** with
   compensating actions and accepted that a human-readable audit trail is the real
   transaction boundary in a clinical setting — not a two-phase commit across four
   services.

3. **"You can skip the read models."** You cannot. The first time the billing service
   joined `Patients` to `Claims` to `Insurers` across a network call, the p99 became a
   tragedy. Read models are not an optimization; they are the design.

> The monolith was not wrong. It was simply too brave a place to keep the patient's
> heartbeat next to the invoice.

## The shape that survived

Four services, one event schema under version control, idempotent consumers, and a
read-model per consumer that can be rebuilt from scratch in an hour. A bug in billing now
takes billing offline — and triage keeps running, which is the entire point.
