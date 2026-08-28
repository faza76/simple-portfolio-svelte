---
title: "Zero-Trust Networking in a Kubernetes Cluster"
date: "Nov 10, 2024"
category: "Security"
description: "Implementing mutual TLS and network policies across a multi-tenant Kubernetes deployment to eliminate lateral movement without sacrificing developer velocity."
tags: ["Kubernetes", "mTLS", "Istio", "Security"]
author: "SYS_ARCHITECT"
readingTime: "7 min"
featured: true
---

The default posture of a Kubernetes cluster is open. Every pod can talk to every other pod,
every namespace can reach every service, and the only thing standing between a compromised
nginx sidecar and the payment database is a ClusterIP service that was never designed to be
a security boundary. Zero-trust networking starts with the assumption that the perimeter
has already been breached.

## The starting point

Our cluster served three teams — payments, notifications, and analytics — all sharing the
same Kubernetes namespace because that's how the template was shipped. A burst of curiosity
traffic from the analytics team's Jupyter notebooks hit the payments service, which hit the
card-vault, which emitted a rate-limit alarm that woke up a human at 3 a.m.

No compromise had occurred. But the blast radius of a single misconfigured pod was the
entire cluster.

## The architecture

We adopted a three-layer approach:

1. **Network policies** — Kubernetes-native `NetworkPolicy` objects that deny all ingress
   by default and explicitly allow only required paths.
2. **Service mesh** — Istio with strict mTLS so that every inter-service call carries a
   cryptographic identity, not just an IP address.
3. **Policy engine** — Kyverno admission controllers that reject pods missing the required
   sidecar label, so no workload can bypass the mesh.

```
[Pod A] --mTLS--> [Istio Proxy] --NetworkPolicy--> [Pod B]
                                  --Kyverno-->
```

## The implementation

Network policies were the first layer. A baseline deny-all per namespace, then explicit
allows:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: payments-ingress
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app: payments-api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: notifications-service
      ports:
        - port: 8080
```

Istio's `PeerAuthentication` enforced strict mTLS at the namespace level. No plaintext
traffic entered the mesh:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: payments
spec:
  mtls:
    mode: STRICT
```

Kyverno closed the gap by rejecting any pod in the `payments` namespace that lacked the
`sidecar.istio.io/inject: "true"` annotation. No exceptions, no manual overrides.

## What surprised us

1. **The developer experience improved.** Network policies forced explicit documentation of
   which services depend on which. The onboarding guide for a new engineer went from "it
   all connects, just try it" to a dependency graph that was actually correct.

2. **Debugging got harder, then better.** The first week, engineers complained about
   mysteriously dropped connections. The second week, they started reading the policies
   before deploying, and the connection-dropped alarms went quiet.

3. **Compliance became a side effect.** HIPAA auditors asked for a network segmentation
   diagram. We handed them the `NetworkPolicy` YAML and the Istio telemetry dashboard.
   The diagram drew itself.

> Trust is a vulnerability. Verify the identity, check the policy, encrypt the wire — and
> do it for every hop, every time.

## The result

The cluster went from 14,000 possible pod-to-pod paths to 23 allowed paths. The payments
namespace is now a vault — not because of a firewall at the edge, but because every single
lateral move is authenticated, authorized, and encrypted. The analytics notebooks can run
wild in their own namespace, and nobody wakes up at 3 a.m.
