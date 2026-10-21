#!/usr/bin/env python3
"""
Ray Placement Groups Exercise: Gang Scheduling and Resource Management

Demonstrates:
- Creating placement groups with different strategies
- Gang-scheduling actors in a placement group
- Observing placement group state and pending groups
- Resource exhaustion and what happens when resources unavailable
"""
import ray
from ray.util.placement_group import placement_group, placement_group_table, remove_placement_group
from ray.util.scheduling_strategies import PlacementGroupSchedulingStrategy
import time
from typing import List

def demo_placement_group_strategies():
    """
    Demonstrate PACK, SPREAD, STRICT_PACK strategies
    """
    print("\n" + "="*60)
    print("DEMO 1: Placement Group Strategies")
    print("="*60)
    
    # Single-node local cluster: 8 logical CPUs, 4 "GPUs" (custom resource)
    ray.init(
        num_cpus=8,
        resources={"simulated_gpu": 4},
        ignore_reinit_error=True
    )
    
    print(f"\nCluster resources: {ray.cluster_resources()}")
    
    # PACK: prefer same node
    print("\n--- Strategy: PACK ---")
    pg_pack = placement_group(
        name="pg_pack",
        bundles=[{"CPU": 2, "simulated_gpu": 1}] * 2,
        strategy="PACK"
    )
    ray.get(pg_pack.ready())
    print(f"✓ PACK placement group created")
    print(f"  Bundles will be packed on as few nodes as possible")
    
    # SPREAD: one bundle per node (prefers)
    print("\n--- Strategy: SPREAD ---")
    pg_spread = placement_group(
        name="pg_spread",
        bundles=[{"CPU": 1, "simulated_gpu": 1}] * 1,
        strategy="SPREAD"
    )
    ray.get(pg_spread.ready(), timeout=10)
    print(f"✓ SPREAD placement group created")
    print(f"  Bundles will be spread across nodes")
    
    # STRICT_PACK: all on same node
    print("\n--- Strategy: STRICT_PACK ---")
    pg_strict_pack = placement_group(
        name="pg_strict_pack",
        bundles=[{"CPU": 1, "simulated_gpu": 1}] * 1,
        strategy="STRICT_PACK"
    )
    ray.get(pg_strict_pack.ready(), timeout=10)
    print(f"✓ STRICT_PACK placement group created")
    print(f"  All bundles MUST be on the same node")
    
    # Show placement group table
    print("\n--- Placement Group Table ---")
    table = placement_group_table()
    for pg_id, pg_info in table.items():
        print(f"{pg_info['name']}:")
        print(f"  State: {pg_info['state']}")
        print(f"  Strategy: {pg_info['strategy']}")
        print(f"  Bundles: {len(pg_info['bundles'])}")
    
    # Cleanup
    remove_placement_group(pg_pack)
    remove_placement_group(pg_spread)
    remove_placement_group(pg_strict_pack)
    
    ray.shutdown()
    print("\n✓ Demo 1 complete")

def demo_gang_scheduling():
    """
    Demonstrate gang-scheduling actors for RL rollout simulation
    """
    print("\n" + "="*60)
    print("DEMO 2: Gang Scheduling GPU Workers")
    print("="*60)
    
    # Simulate 4 "GPUs"
    ray.init(
        num_cpus=8,
        resources={"simulated_gpu": 4},
        ignore_reinit_error=True
    )
    
    print("\nSimulating RL rollout with 4 GPU workers")
    print("Creating placement group with STRICT_PACK (all GPUs on same node)")
    
    # Create placement group for 4 GPU workers
    pg = placement_group(
        bundles=[{"CPU": 1, "simulated_gpu": 1}] * 4,
        strategy="STRICT_PACK",
        name="rl_gpu_workers"
    )
    
    # Wait for placement group to be ready
    start = time.time()
    ray.get(pg.ready())
    elapsed = time.time() - start
    print(f"✓ Placement group ready in {elapsed:.3f}s")
    
    # Define GPU worker actor
    @ray.remote(num_cpus=1, resources={"simulated_gpu": 1})
    class GPUWorker:
        def __init__(self, worker_id):
            self.worker_id = worker_id
            self.episodes_completed = 0
        
        def run_episode(self, episode_id):
            # Simulate GPU rollout
            self.episodes_completed += 1
            return {
                "worker_id": self.worker_id,
                "episode_id": episode_id,
                "status": "success"
            }
        
        def get_stats(self):
            return {
                "worker_id": self.worker_id,
                "episodes_completed": self.episodes_completed
            }
    
    # Create 4 workers in the placement group (one per bundle)
    print("\nCreating 4 GPU workers in placement group...")
    workers: List[ray.actor.ActorHandle] = []
    for i in range(4):
        worker = GPUWorker.options(
            scheduling_strategy=PlacementGroupSchedulingStrategy(
                placement_group=pg,
                placement_group_bundle_index=i
            )
        ).remote(i)
        workers.append(worker)
    
    print("✓ All workers created")
    
    # Run episodes across all workers
    print("\nRunning 20 episodes across 4 workers...")
    futures = []
    for episode_id in range(20):
        worker = workers[episode_id % 4]
        future = worker.run_episode.remote(episode_id)
        futures.append(future)
    
    # Wait for all episodes
    results = ray.get(futures)
    print(f"✓ All episodes completed: {len(results)} results")
    
    # Get worker stats
    print("\n--- Worker Statistics ---")
    stats = ray.get([worker.get_stats.remote() for worker in workers])
    for stat in stats:
        print(f"Worker {stat['worker_id']}: {stat['episodes_completed']} episodes")
    
    # Cleanup
    remove_placement_group(pg)
    ray.shutdown()
    print("\n✓ Demo 2 complete")

def demo_resource_exhaustion():
    """
    Demonstrate what happens when resources are insufficient
    """
    print("\n" + "="*60)
    print("DEMO 3: Resource Exhaustion and Pending Placement Groups")
    print("="*60)
    
    # Small cluster: only 4 CPUs, 2 "GPUs"
    ray.init(
        num_cpus=4,
        resources={"simulated_gpu": 2},
        ignore_reinit_error=True
    )
    
    print(f"\nCluster has only 4 CPUs and 2 simulated_gpu")
    print(f"Resources: {ray.cluster_resources()}")
    
    # Try to create a placement group requiring 4 GPUs (more than available)
    print("\nAttempting to create placement group requiring 4 GPUs (STRICT_PACK)...")
    pg_large = placement_group(
        bundles=[{"CPU": 1, "simulated_gpu": 1}] * 4,
        strategy="STRICT_PACK",
        name="pg_too_large"
    )
    
    # Check status without blocking
    print("Placement group created (not yet scheduled)")
    
    # Check placement group table
    time.sleep(1)  # Give GCS time to schedule
    pg_info = placement_group_table(pg_large)
    
    print(f"\nPlacement group state: {pg_info['state']}")
    if pg_info['state'] == 'PENDING':
        print("✓ As expected, placement group is PENDING (insufficient resources)")
        print("  STRICT_PACK requires all 4 bundles on one node, but cluster has only 2 GPUs")
    else:
        print(f"  State: {pg_info['state']}")
    
    # Try to use the placement group (will fail or timeout)
    print("\nTrying to schedule an actor in the pending placement group...")
    
    @ray.remote(num_cpus=1, resources={"simulated_gpu": 1})
    class Worker:
        def ping(self):
            return "alive"
    
    worker = Worker.options(
        scheduling_strategy=PlacementGroupSchedulingStrategy(
            placement_group=pg_large,
            placement_group_bundle_index=0
        )
    ).remote()
    
    # Try to call method with short timeout
    try:
        result = ray.get(worker.ping.remote(), timeout=3)
        print(f"Unexpected: actor responded: {result}")
    except ray.exceptions.GetTimeoutError:
        print("✓ Actor method timed out (expected: actor can't be created until PG is ready)")
    
    # Show how to detect pending placement groups
    print("\n--- Detecting Pending Placement Groups ---")
    table = placement_group_table()
    pending_pgs = [
        (pg_id, info['name'], info['state'])
        for pg_id, info in table.items()
        if info['state'] == 'PENDING'
    ]
    
    if pending_pgs:
        print(f"Found {len(pending_pgs)} pending placement group(s):")
        for pg_id, name, state in pending_pgs:
            print(f"  - {name}: {state}")
    else:
        print("No pending placement groups")
    
    # Cleanup
    remove_placement_group(pg_large)
    ray.shutdown()
    print("\n✓ Demo 3 complete")

def demo_capture_child_tasks():
    """
    Demonstrate placement_group_capture_child_tasks flag
    """
    print("\n" + "="*60)
    print("DEMO 4: placement_group_capture_child_tasks Flag")
    print("="*60)
    
    ray.init(num_cpus=8, ignore_reinit_error=True)
    
    # Create placement group
    pg = placement_group(
        bundles=[{"CPU": 4}],
        strategy="PACK",
        name="pg_with_capture"
    )
    ray.get(pg.ready())
    print("✓ Placement group created")
    
    @ray.remote
    def parent_task():
        # Child task will also be scheduled in the placement group
        @ray.remote
        def child_task():
            return "child executed in placement group"
        
        return ray.get(child_task.remote())
    
    # Schedule parent in placement group with placement_group_capture_child_tasks=True
    result = ray.get(parent_task.options(
        scheduling_strategy=PlacementGroupSchedulingStrategy(
            placement_group=pg,
            placement_group_capture_child_tasks=True
        )
    ).remote())
    
    print(f"✓ Parent task spawned child task: {result}")
    print("  Child was automatically scheduled in the same placement group")
    
    remove_placement_group(pg)
    ray.shutdown()
    print("\n✓ Demo 4 complete")

if __name__ == "__main__":
    try:
        demo_placement_group_strategies()
        demo_gang_scheduling()
        demo_resource_exhaustion()
        demo_capture_child_tasks()
        
        print("\n" + "="*60)
        print("✓ ALL DEMOS COMPLETED SUCCESSFULLY")
        print("="*60)
        print("\nKey Takeaways:")
        print("1. Placement groups reserve resources atomically (gang scheduling)")
        print("2. PACK/SPREAD/STRICT_PACK/STRICT_SPREAD control placement strategy")
        print("3. Use STRICT_PACK for multi-GPU training (all GPUs on same node)")
        print("4. Pending placement groups block actor creation until resources available")
        print("5. placement_group_capture_child_tasks=True automatically schedules child tasks in PG")
        print("\nNext: Read Lesson 12 (KubeRay) and Lesson 13 (RL in Production)")
    except Exception as e:
        print(f"\n✗ Demo failed: {e}")
        import traceback
        traceback.print_exc()
