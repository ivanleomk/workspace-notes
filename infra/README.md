# Eval Infrastructure Deep Dive

**Master the infrastructure that powers LLM evaluation and RL orchestration at scale**

This series teaches you how to build production-grade eval infrastructure from first principles. You'll learn the isolation primitives behind every major sandbox platform, understand the trade-offs between containers and microVMs, and design your own orchestrator for distributed eval workloads.

## Start Here

1. **[Curriculum](curriculum.md)** — Full 25-lesson syllabus with learning objectives
2. **[Lesson 01: Linux Namespaces and cgroups v2](01-linux-namespaces-cgroups/)** — The building blocks of every container ✅
3. **[Lesson 02: seccomp-bpf and overlayfs](02-seccomp-overlayfs/)** — Syscall filtering and union filesystems ✅
4. **[Lesson 03: runc vs gVisor vs Kata Containers](03-runc-gvisor-kata/)** — Container runtime comparison and isolation spectrum ✅
5. **[Lesson 04: Firecracker Internals and Booting a microVM](04-firecracker-microvm/)** — Minimal VMMs, KVM, and ≤125ms boot times ✅
6. **[Lesson 05: Snapshot/Restore and Forking Agent State](05-snapshot-restore-forking/)** — Warm pools, userfaultfd, and GRPO-style forking ✅
7. **[Lesson 06: E2B's Open-Source Runtime Architecture](06-e2b-runtime/)** — Production snapshot/fork system with control/data plane separation ✅

## Live Lessons

Visit the live interactive lessons at:
- [Lesson 01: Linux Namespaces and cgroups v2](https://ivanleomk.github.io/workspace-notes/infra/01-linux-namespaces-cgroups/)
- [Lesson 02: seccomp-bpf and overlayfs](https://ivanleomk.github.io/workspace-notes/infra/02-seccomp-overlayfs/)
- [Lesson 03: runc vs gVisor vs Kata Containers](https://ivanleomk.github.io/workspace-notes/infra/03-runc-gvisor-kata/)
- [Lesson 04: Firecracker Internals and Booting a microVM](https://ivanleomk.github.io/workspace-notes/infra/04-firecracker-microvm/)
- [Lesson 05: Snapshot/Restore and Forking Agent State](https://ivanleomk.github.io/workspace-notes/infra/05-snapshot-restore-forking/)
- [Lesson 06: E2B's Open-Source Runtime Architecture](https://ivanleomk.github.io/workspace-notes/infra/06-e2b-runtime/)

## What You'll Learn

- **Phase 1 (Lessons 01–04):** Linux isolation primitives — namespaces, cgroups, seccomp, overlayfs, runc, gVisor, Kata, Firecracker
- **Phase 2 (Lessons 05–06):** Snapshot/restore and forking agent state with Firecracker and E2B
- **Phase 3 (Lessons 07–09):** Hosted sandbox platforms — Daytona, Modal, kubernetes-sigs/agent-sandbox
- **Phase 4 (Lessons 10–13):** Ray orchestration for multi-GPU RL — tasks, actors, placement groups, KubeRay, fault tolerance
- **Phase 5 (Lessons 14–17):** Real eval harnesses — SWE-bench, Inspect AI, OpenHands, warm pools, image caching
- **Phase 6 (Lessons 18–20):** Production concerns — exec protocols, retries, idempotency, observability, cost control
- **Phase 7 (Lessons 21–24):** Advanced topics — DeepSWE's K8s migration, gVisor deep dive, GPU in sandboxes, live migration
- **Capstone (Lesson 25):** Design your own orchestrator — reference architecture and build options

## Prerequisites

- Linux systems knowledge (processes, files, networking)
- Python or TypeScript (exercises are mostly Python)
- Docker basics
- Access to a Linux machine (VM or bare metal; some lessons need KVM)

## Primary Sources

Every lesson cites primary documentation:
- [Linux kernel docs](https://docs.kernel.org)
- [Firecracker](https://github.com/firecracker-microvm/firecracker)
- [gVisor](https://gvisor.dev)
- [Ray](https://docs.ray.io)
- [E2B Runtime](https://github.com/e2b-dev/runtime)
- [SWE-bench](https://github.com/SWE-bench/SWE-bench)
- [Inspect AI](https://inspect.aisi.org.uk/sandboxing.html)

## About This Series

Created by Ivan Leo as a companion to the [paper curriculum](../lessons/) for building real-world eval infrastructure. Each lesson includes:
- First-principles explanations with cited sources
- Visual diagrams (mermaid.js)
- Hands-on exercises with runnable code
- Interactive quizzes with detailed feedback
- Links to production systems (E2B, Modal, SWE-bench, OpenHands, verl)

---

**[Start with the Curriculum →](curriculum.md)**
