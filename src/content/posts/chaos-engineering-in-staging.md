---
title: "Chaos Engineering in Staging: Breaking Things Before Production Does"
date: "Oct 05, 2024"
category: "DevOps"
description: "A practical guide to running chaos experiments in a staging environment — with guardrails that keep your SRE team from losing sleep."
tags: ["Chaos Engineering", "Resilience", "DevOps", "Observability"]
author: "SYS_ARCHITECT"
readingTime: "7 min"
featured: false
---

Chaos engineering has a branding problem. The word "chaos" suggests unpredictability, which is the opposite of what the discipline actually does. Real chaos engineering is about **hypotheses, experiments, and controlled failure** — the scientific method applied to distributed systems.

We started running chaos experiments in staging after our third production incident in six months. All three had the same root cause: an implicit assumption about network reliability. The systems assumed that Service A could always reach Service B. When it couldn't — because of a network partition, a DNS blip, or a slow dependency — the failure mode was catastrophic and cascading.

## The principle

Chaos engineering is not "kill random pods and see what happens." It is:

1. **Define a steady state.** What does "working" look like? Metrics, SLOs, behavior.
2. **Form a hypothesis.** "If we introduce a 500ms latency between Service A and Service B, the system will degrade gracefully — retries will absorb the delay, and the user will see a slower response, not an error."
3. **Introduce the fault.** In staging. With a kill switch.
4. **Observe the outcome.** Did the system behave as hypothesized?
5. **Fix the gaps.** If the hypothesis was wrong, the system had a resilience gap.

## The guardrails

We run chaos in staging, not production. That's the first guardrail. The second: every experiment has a **blast radius** defined before it runs.

```yaml
experiment:
  name: "database-latency"
  target: "postgres-primary"
  fault:
    type: "latency"
    duration: "5m"
    delay: "200ms"
    jitter: "50ms"
  steady_state:
    metric: "request_success_rate"
    threshold: 0.99
  abort_conditions:
    - metric: "request_success_rate"
      threshold: 0.90
      duration: "30s"
    - metric: "connection_pool_exhausted"
      threshold: 1
  rollback: "automatic"
```

The `abort_conditions` are critical. If the experiment causes more damage than expected, it stops automatically. We use a simple controller that monitors the metrics and kills the fault injection if thresholds are breached.

## The tooling

We use **Litmus** (open-source chaos engineering framework) for fault injection and **Grafana** for observation. The integration is straightforward:

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: "db-latency-experiment"
spec:
  appinfo:
    appns: staging
    applabel: "app=clinical-notes"
    appkind: deployment
  chaosServiceAccount: litmus-admin
  experiments:
    - name: "pod-network-latency"
      spec:
        components:
          env:
            - name: "NETWORK_LATENCY"
              value: "200"
            - name: "JITTER"
              value: "50"
            - name: "CONTAINER_IMAGE"
              value: "litmuschaos/network-chaos:latest"
```

The experiment runs for five minutes. During that window, we monitor:

- **Request success rate** — should stay above 99%.
- **P99 latency** — should increase but not exceed 2x baseline.
- **Circuit breaker state** — should trip if latency exceeds the threshold.
- **Retry storm detection** — retries should be bounded, not exponential without a cap.

## What we found

The first experiment was humbling. We introduced 200ms of latency between the Clinical Notes service and the database. The hypothesis: the connection pool would absorb it, and p99 would rise but stay within SLO.

The reality: the connection pool was configured with a 30-second checkout timeout. The latency caused connections to be held longer, the pool exhausted in 45 seconds, and the service returned 503s. The circuit breaker never tripped because it was configured on the **outbound** HTTP calls, not the **outbound** database calls.

Three fixes:

1. **Connection pool timeout** reduced to 5 seconds.
2. **Circuit breaker** added to the database client.
3. **Connection pool monitoring** added to the SLO — not just request success rate, but pool utilization as a leading indicator.

## The second round

After the first round of fixes, we ran a broader set of experiments:

| Experiment | Hypothesis | Result | Fix |
| --- | --- | --- | --- |
| DNS failure (30s) | Retries would use cached DNS | Correct — no user impact | None needed |
| S3 outage (5m) | File uploads would queue, not fail | Correct — retry queue worked | Added queue depth alert |
| Redis failure (2m) | Cache misses would hit DB, p99 would rise | Partially correct — DB CPU spiked to 95% | Added cache-warming for hot keys |
| Cross-AZ latency (100ms) | Service mesh would handle it | Incorrect — mTLS renegotiation caused timeout | Tuned TLS session respiration |

## The culture shift

The hardest part was not the tooling. It was convincing the team that breaking things in staging is valuable. The instinct is to keep staging "clean" — a mirror of production that never fails. That instinct is wrong. Staging should be a **laboratory**, not a showroom.

We now run chaos experiments as part of the CI pipeline for infrastructure changes. If a PR touches a service's resilience configuration — timeouts, retries, circuit breakers — the chaos experiment suite runs automatically. If the experiment fails, the PR doesn't merge.

## The steady state

Six months in, we've run 47 experiments. We've found 12 resilience gaps, all fixed before they reached production. The SLO breach rate dropped from three incidents per quarter to zero.

Chaos engineering is not about chaos. It's about **confidence**. The confidence that when the network hiccups at 3 AM — and it will — the system will handle it, because you already broke it in staging and watched it recover.
