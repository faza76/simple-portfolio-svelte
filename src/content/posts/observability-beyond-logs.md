---
title: "Observability Beyond Logs: Traces, Metrics, and the Three Pillars"
date: "Jan 15, 2025"
category: "DevOps"
description: "Why structured logs alone are insufficient for diagnosing distributed system failures, and how OpenTelemetry traces and Prometheus metrics fill the gaps without adding operational burden."
tags: ["OpenTelemetry", "Prometheus", "Observability", "DevOps"]
author: "SYS_ARCHITECT"
readingTime: "8 min"
featured: true
image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfdMKQpw_d5XorfEXgGYABmLrr6ZxAuJD7ws98yD_IkIkSmGsqLZbVlCFYNj2IKgttV9wF-09poDchZeYS5It3S5d3RItEor5yzIprNj5OfeTxwkCqfswA791pmb0837RILNu9cMCVmkcPDHDDYsFt0b7-K9rwzhe0EUHGyjVJjpmrnM13cRWjSIiTITEyJw5Q17yALNocXoUtRNcukHaqgF2qO1Bnvo1GOQq-pDT8GF9tZLOdT5A"
alt: "A visualization of distributed tracing across microservices."
---

The first sign of trouble was a customer complaint: "Your app is slow." The logs showed no
errors. Every request returned 200. The database queries were under 10 ms. By every metric
the dashboards were monitoring, the system was healthy. It was not.

The problem was a third-party API call buried three layers deep in the request path — a
call that succeeded every time but took 12 seconds on average. The logs never captured it
because the developer who wrote the integration logging had graduated from the team two
years earlier. The metrics never caught it because the endpoint's p50 was fine. It took a
distributed trace to make the invisible visible.

## The three pillars

Observability is not logging with extra steps. It is the ability to answer arbitrary
questions about a system's behavior from the outside, without deploying new code. The
industry converged on three complementary signals:

| Signal | Answers | Cost |
| --- | --- | --- |
| **Logs** | What happened at a specific moment? | Low — just write to stdout |
| **Metrics** | How is the system behaving over time? | Low — a counter, a histogram |
| **Traces** | Where did time go across service boundaries? | Medium — requires propagation |

Each pillar has blind spots. Logs without metrics miss trends. Metrics without traces miss
causes. Traces without logs miss context. The power is in the combination.

## Structured logging as the foundation

The shift from unstructured to structured logs is the cheapest win. A log line that is
parseable is a log line that is queryable:

```json
{
  "timestamp": "2025-01-15T14:23:01.123Z",
  "level": "warn",
  "service": "payments",
  "traceId": "abc123",
  "spanId": "def456",
  "message": "Third-party API latency exceeded threshold",
  "latency_ms": 12430,
  "endpoint": "https://acme-payments.com/charge"
}
```

The `traceId` and `spanId` fields are the bridge to distributed tracing. Without them,
the log is an isolated fact. With them, it becomes a annotation on a request's journey
across services.

## Distributed tracing with OpenTelemetry

Tracing answers the question that logs and metrics cannot: "Which hop is responsible?"

A trace is a tree of spans. Each span represents a unit of work — an HTTP call, a
database query, a message publish. OpenTelemetry provides the SDK to create spans
automatically for most frameworks:

```python
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

FastAPIInstrumentor().instrument_app(app)
SQLAlchemyInstrumentor().instrument_engine(engine)
```

Once instrumented, every request produces a trace. The 12-second API call that was
invisible in logs became the longest span in a trace that should have taken 200 ms.
The problem was not in our code — it was in a third-party dependency that no log had
ever captured.

## Prometheus metrics for the long view

Metrics answer "how has this changed over time?" A histogram on request latency, a
counter on failed payments, a gauge on queue depth — these are the signals that trigger
alerts and drive capacity planning.

```python
from prometheus_client import Histogram

request_duration = Histogram(
    'http_request_duration_seconds',
    'Request latency',
    ['method', 'path', 'status'],
    buckets=[.01, .05, .1, .25, .5, 1, 2.5, 5, 10, 30]
)
```

The p99 latency graph showed a flat line while the customer complained. But the p99.9
graph — which nobody was monitoring — showed spikes every 45 minutes, exactly matching
the third-party API's rate-limit cooldown window. The metric existed; the dashboard did
not.

## The practical stack

The deployment was straightforward:

1. **OpenTelemetry Collector** — receives traces, metrics, and logs from all services.
   Export traces to Tempo, metrics to Prometheus, logs to Loki.
2. **Grafana** — single pane of glass. Dashboards link traces to logs via `traceId`,
   and traces to metrics via service labels.
3. **Alerting** — Prometheus rules on derived metrics (error rate, latency p99.9), not
   on raw request counts.

```
[Service] --OTLP--> [OTel Collector] --> [Tempo]   (traces)
                                       --> [Prometheus] (metrics)
                                       --> [Loki]   (logs)
                                          |
                                     [Grafana]
```

## What I wish I had known

1. **Instrument at the edges first.** HTTP ingress, database calls, message consumers.
   These are the boundaries where latency hides. Internal function calls rarely matter
   until they do, and when they do, you can add a span in five minutes.

2. **Head-based sampling is a trap.** Sampling 1% of traces means you miss 99% of the
   interesting failures. Use tail-based sampling at the collector — keep all traces,
   drop the boring ones, and always keep errors and slow requests.

3. **Dashboards are a symptom.** If you need a dashboard to understand your system, the
   system is not observable — it is just monitored. Observability means you can ask a
   new question on a Tuesday afternoon and get an answer without deploying anything.

> Logs tell you what happened. Metrics tell you how often. Traces tell you why. You need
> all three to diagnose a distributed failure — and only one of them would have caught the
> 12-second API call before the customer did.

## The result

Mean time to diagnosis dropped from hours to minutes. The third-party API was replaced
with a faster provider within a week — not because anyone was told to fix it, but because
the trace made the cost impossible to ignore. The dashboards now include p99.9 latency,
and the team has a standing rule: if a customer reports slowness, open the trace first,
the logs second, and the metrics never.
