---
title: "Bridging the Gap: .NET in Modern Manufacturing"
date: "Sep 15, 2024"
category: "Manufacturing"
description: "Integrating C# microservices with legacy PLC controllers to create unified, real-time dashboards for assembly line automation."
tags: [".NET Core", "gRPC", "SignalR", "PLC"]
author: "SYS_ARCHITECT"
readingTime: "6 min"
featured: false
---

The factory floor is a museum of working machines. A 1998 lathe, a 2010 CNC, and a brand-new
articulating robot all report their state over different protocols, at different cadences,
in different dialects of "running." Bridging them into a single, coherent dashboard is less
about protocol translation and more about building a stable lingua franca.

## The landscape

- **PLC controllers** speak Modbus TCP and OPC UA over a flat industrial network.
- **Modern MES services** speak gRPC and HTTP/JSON over a routed enterprise network.
- **Operators** expect a browser dashboard with sub-second updates.

The instinct is to write adapters for each. The discipline is to design a single internal
contract and let each source conform to it at the edge.

## The bridge

A thin .NET worker per machine normalizes the vendor's wire format into a canonical
telemetry envelope:

```csharp
public record Telemetry(
    string AssetId,
    string Metric,
    double Value,
    DateTimeOffset RecordedAt,
    TelemetryQuality Quality);
```

Each worker publishes to a shared channel (`System.Threading.Channels` for in-process, or
RabbitMQ for cross-process), and an aggregation service fans the stream out to a SignalR
hub that the browser subscribes to.

```
[PLC] --(Modbus)-->  Worker --(Channel)--> Aggregator --(SignalR)--> [Browser]
```

## What made it hold

1. **The envelope was the contract.** Vendors changed, models changed, but every downstream
   consumer only ever depended on `Telemetry`. Swapping a 1998 lathe for a 2026 robot
   touched exactly one adapter.

2. **Backpressure was explicit.** A `Channel<T>` with a bounded capacity drops the oldest
   stale reading and emits a `Quality = Stale` marker instead of blocking the control loop.
   The dashboard shows the gap honestly rather than hiding it behind a frozen number.

3. **Observability was not an afterthought.** Every worker emits OpenTelemetry traces. The
   first time a machine "went dark," the span told us which hop had died before a human
   even opened the dashboard.

> Integration projects don't fail at the protocol; they fail at the seam. Design the seam
> first, and the protocol follows.

## The result

A single dashboard, three generations of machinery, one `Telemetry` record, and a mean
time to detection for a dropped connection that dropped from "until someone walks the floor"
to under fifteen seconds.
