# Eval Infrastructure Deep Dive: Curriculum

**A world-class guide to building production-grade eval and RL orchestration infrastructure**

*Ivan Leo · 2026*

---

## How This Series Works

This curriculum teaches you how to build the infrastructure that powers LLM evaluation and reinforcement learning at scale. You'll learn the primitives that underpin every major sandbox platform, understand the trade-offs between isolation mechanisms, and ultimately design your own orchestrator.

**Learning objectives:**
- Master Linux isolation primitives (namespaces, cgroups, seccomp) from first principles
- Understand the security and performance trade-offs between containers, gVisor, and microVMs
- Build snapshot/restore and forking systems for fast eval throughput
- Deploy Ray-based orchestration for multi-GPU RL workloads
- Design production eval harnesses with proper retry logic, idempotency, and observability

**How to use this curriculum:**
1. Lessons build on each other—start from 01 and work sequentially
2. Every lesson includes hands-on exercises with runnable code
3. Primary sources (man pages, papers, production codebases) are cited throughout
4. Exercises assume a Linux environment with Docker; some need bare metal for KVM

---

## Curriculum Outline

### Phase 1: Isolation Primitives (Lessons 01–04)

**01. Linux Namespaces and cgroups v2 by Hand** ✅ *Complete*  
Master the building blocks of every container: namespaces (mnt, pid, net, uts, ipc, user, cgroup, time) and cgroups v2 (cpu, memory, io, pids). Build a minimal sandbox from scratch in Python.

**02. seccomp-bpf and overlayfs** 📝 *Planned*  
Harden your sandbox with syscall filtering and union filesystems. Understand Docker's default seccomp profile and how gVisor uses `SECCOMP_RET_TRAP` to intercept syscalls.

**03. runc vs gVisor vs Kata Containers** 📝 *Planned*  
Compare the three major container runtimes: runc (shared kernel), gVisor (userspace kernel), and Kata (hardware virtualization). Measure syscall and I/O overhead on real eval workloads.

**04. Firecracker Internals and Booting a microVM** 📝 *Planned*  
Dive into AWS's minimal VMM. Boot Firecracker by hand via its API, set up tap networking, and understand the jailer's security model. Target: ≤125ms from InstanceStart to guest init.

### Phase 2: Snapshot, Restore, and Forking (Lessons 05–06)

**05. Snapshot/Restore and Forking Agent State** 📝 *Planned*  
Build fast warm pools with Firecracker snapshots and `userfaultfd` lazy memory. Implement GRPO-style forking: run an agent to step *k*, fork N children, sample differently. Handle clone hazards (RNG seeds, MAC addresses, VMGenID).

**06. E2B's Open-Source Runtime Architecture** 📝 *Planned*  
Study a production snapshot/fork system. Understand E2B's control plane (API + placement), data plane (orchestrator + envd), and how pause/resume/fork work end-to-end. Deploy E2B Embed locally.

### Phase 3: Hosted Sandbox Platforms (Lessons 07–09)

**07. Daytona Architecture and Container vs VM Classes** 📝 *Planned*  
Explore Daytona's two isolation tiers. Understand when to use containers (shared kernel, GPU via exclusive allocation) vs VMs (own kernel, pause/resume, fork, hot snapshots). Note: OSS repo frozen June 2026.

**08. Modal Sandboxes: gVisor, Memory Snapshots, and Elasticity** 📝 *Planned*  
Learn Modal's dual runtime (gVisor default, VM for Docker-in-sandbox). Use filesystem snapshots for setup sharing, memory snapshots for debugging, and named images to avoid rebuild waits. Run SWE-bench's Modal backend.

**09. Other Open-Source Sandboxes** 📝 *Planned*  
Survey microsandbox (libkrun microVMs, embeddable), kubernetes-sigs/agent-sandbox (CRDs for warm pools + templates), Beam/beta9 (AGPL, self-hostable serverless), and Fly Machines (Firecracker with fast stop/start).

### Phase 4: Ray for Orchestration (Lessons 10–13)

**10. Ray Core: Tasks, Actors, Object Store, and GCS** 📝 *Planned*  
Understand Ray's execution model. Build async actor pools for I/O-bound sandbox orchestration. Learn when Ray's object store (Plasma) helps vs when it becomes a bottleneck.

**11. Ray Scheduling, Placement Groups, and Resource Management** 📝 *Planned*  
Master Ray's resource-based scheduler. Use placement groups to gang-schedule GPU workers. Understand DEFAULT vs SPREAD vs PACK strategies and soft vs hard node affinity.

**12. KubeRay, Autoscaling, and GCS Fault Tolerance** 📝 *Planned*  
Deploy Ray on Kubernetes with the RayCluster CRD. Enable GCS HA with Redis. Size head nodes properly. Handle the three failure modes: head-node bottleneck, object store full, actor death.

**13. Ray in Production RL: verl, OpenRLHF, SkyRL** 📝 *Planned*  
Study how real systems use Ray for RL rollouts. verl's HybridFlow architecture, OpenRLHF's hybrid engine (80% time on generation), and SkyRL-OpenHands' crun + aiodocker runtime (80–100 containers per 16 CPUs).

### Phase 5: Real-World Eval Harnesses (Lessons 14–17)

**14. SWE-bench: Layered Images and Per-Instance Caching** 📝 *Planned*  
Understand SWE-bench's three-layer image model (base → environment → instance). Learn why `cache_level=instance` is 2TB. Classify infra failures vs model failures with `infra_failure.py`.

**15. Inspect AI Sandboxes: Interface Design and Provider Abstraction** 📝 *Planned*  
Study Inspect's `SandboxEnvironment` interface (`exec`, `read_file`, `write_file`, `connection`). Implement the k8s provider (Helm + Cilium + gVisor). Add output caps, timeout retries, and anomaly detection.

**16. OpenHands Remote Runtime: Agent-Server Split** 📝 *Planned*  
Explore OpenHands' architecture: agent loop in the driver, tool executor in the sandbox, connected via WebSocket `RemoteConversation`. Deploy `agent-server` images for SWE-bench evaluation.

**17. Warm Pools, Image Caching, and Preloading** 📝 *Planned*  
Solve the cold-start problem. Pre-pull images by digest onto NVMe nodes. Build warm pools sized from queue depth. Use SWE-smith's one-image-per-repo strategy to shrink cache from 2TB (SWE-bench instance level) to <100GB.

### Phase 6: Production Concerns (Lessons 18–20)

**18. Exec Protocols, Timeouts, Retries, and Idempotency** 📝 *Planned*  
Design a robust exec protocol with three nested timeouts (per-exec, per-episode, sandbox lifetime). Classify retry cases: infra-transient (provider 5xx, placement failure) vs infra-permanent (bad image) vs model outcome (never retry). Make result writes idempotent with content-addressed keys.

**19. Result Storage, Determinism, and Provenance** 📝 *Planned*  
Build exactly-once result capture. Pin image digests. Handle clone non-uniqueness (reseed RNGs, resync clocks, unique MACs). Store full provenance (image digest, template ID, harness SHA, seed, timeouts, model revision).

**20. Observability, Cost Control, and Leak Sweepers** 📝 *Planned*  
Add OpenTelemetry tracing (one span per work item). Track queue depth, create/resume latency histograms, timeout rates, cost per resolved instance. Use auto-pause during LLM waits (Vercel reports 71–98% of agent runtime). Run cleanup sweepers for leaked sandboxes.

### Phase 7: Advanced Topics (Lessons 21–24)

**21. DeepSWE's Kubernetes Migration: When Docker Daemons Fail** 📝 *Planned*  
Learn from Together/Agentica's scale-out story. Understand why thousands of concurrent containers crashed `dockerd` and how they moved to K8s with NVMe-preloaded images and 200-core nodes.

**22. gVisor Deep Dive: Sentry, Gofer, Platforms (systrap vs KVM)** 📝 *Planned*  
Understand gVisor's userspace kernel architecture. Compare the systrap platform (seccomp traps, default since mid-2023) vs KVM platform (best on bare metal). Measure file I/O and syscall overhead on pytest and pip install.

**23. GPU in Sandboxes: nvproxy, cuda-checkpoint, and Kata Limitations** 📝 *Planned*  
Route GPU workloads. Modal and Northflank send GPU sandboxes to gVisor (nvproxy). Kata+Firecracker has no GPU support. Use gVisor's `cuda-checkpoint` for checkpoint/restore with GPU state.

**24. Live Migration, Hotplug, and Cloud Hypervisor** 📝 *Planned*  
Explore Cloud Hypervisor's advanced features: CPU/memory/PCI hotplug, live migration, and virtio-only device model. Understand when to choose Cloud Hypervisor over Firecracker (Kata can use either).

### Capstone (Lesson 25)

**25. Design Your Own Orchestrator** 📝 *Planned*  
Synthesize everything into a reference architecture. Spec → planner → durable queue (Postgres `SKIP LOCKED`) → scheduler (admission control, cost budgets, image-cache affinity) → sandbox pool manager (template snapshots, warm pools, fork-on-demand) → rollout workers (asyncio or Ray async actors) → inference (vLLM/SGLang in placement groups or external API). Choose your build: (A) Ray + E2B, (B) K8s + agent-sandbox + gVisor/Kata, or (C) Firecracker direct.

---

## Prerequisites

- Linux systems knowledge (processes, files, networking)
- Python or TypeScript (most exercises are Python)
- Docker basics
- Access to a Linux box (VM or bare metal; some lessons need KVM for microVMs)
- For GPU lessons: access to a node with NVIDIA GPUs

## Primary References

Every lesson cites primary sources. Key references for the overall curriculum:

- **Linux kernel documentation**: [https://docs.kernel.org](https://docs.kernel.org)
- **Firecracker**: [https://github.com/firecracker-microvm/firecracker](https://github.com/firecracker-microvm/firecracker)
- **gVisor**: [https://gvisor.dev](https://gvisor.dev)
- **Ray**: [https://docs.ray.io](https://docs.ray.io)
- **E2B Runtime**: [https://github.com/e2b-dev/runtime](https://github.com/e2b-dev/runtime)
- **SWE-bench**: [https://github.com/SWE-bench/SWE-bench](https://github.com/SWE-bench/SWE-bench)
- **Inspect AI**: [https://inspect.aisi.org.uk/sandboxing.html](https://inspect.aisi.org.uk/sandboxing.html)

---

## Updates and Contributions

This curriculum is a living document. As production systems evolve and new research emerges, lessons will be updated to reflect current best practices.

For corrections or suggestions, open an issue on the [workspace-notes](https://github.com/ivanleomk/workspace-notes) repo.

---

**Next**: Start with [Lesson 01: Linux Namespaces and cgroups v2 by Hand](01-linux-namespaces-cgroups/)
