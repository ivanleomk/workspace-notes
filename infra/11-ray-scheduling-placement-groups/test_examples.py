#!/usr/bin/env python3
"""
Test examples for Lesson 11: Ray Scheduling and Placement Groups
This script tests the core concepts before they go into the lesson
"""
import ray
import time
import sys

def test_resource_model():
    """Test Ray's resource model and num_cpus defaults"""
    print("\n=== Testing Resource Model ===")
    ray.init(num_cpus=4, num_gpus=0, resources={"custom_gpu": 2}, ignore_reinit_error=True)
    
    # Show cluster resources
    resources = ray.cluster_resources()
    print(f"Cluster resources: {resources}")
    
    # Test task default resources
    @ray.remote
    def task_default():
        return "task with default resources"
    
    @ray.remote(num_cpus=2)
    def task_with_cpus():
        return "task with 2 CPUs"
    
    @ray.remote(num_cpus=0.5, resources={"custom_gpu": 1})
    def task_with_custom():
        return "task with custom resource"
    
    # Test actor default resources
    @ray.remote
    class ActorDefault:
        def get_info(self):
            return "actor with default resources"
    
    @ray.remote(num_cpus=1)
    class ActorWithCpus:
        def get_info(self):
            return "actor with 1 CPU"
    
    # Create and test
    result1 = ray.get(task_default.remote())
    result2 = ray.get(task_with_cpus.remote())
    result3 = ray.get(task_with_custom.remote())
    
    actor1 = ActorDefault.remote()
    actor2 = ActorWithCpus.remote()
    
    print(f"Task results: {result1}, {result2}, {result3}")
    print(f"Actors created successfully")
    
    ray.shutdown()
    print("✓ Resource model test passed")
    return True

def test_placement_groups():
    """Test placement group creation and strategies"""
    print("\n=== Testing Placement Groups ===")
    ray.init(num_cpus=8, num_gpus=0, resources={"custom_gpu": 4}, ignore_reinit_error=True)
    
    from ray.util.placement_group import placement_group, placement_group_table
    from ray.util.scheduling_strategies import PlacementGroupSchedulingStrategy
    
    # Test PACK strategy
    pg_pack = placement_group(
        name="pg_pack",
        bundles=[
            {"CPU": 2},
            {"CPU": 2},
            {"CPU": 2}
        ],
        strategy="PACK"
    )
    ray.get(pg_pack.ready())
    print(f"✓ PACK placement group created: {pg_pack.id.hex()}")
    
    # Test SPREAD strategy
    pg_spread = placement_group(
        name="pg_spread",
        bundles=[
            {"CPU": 1},
            {"CPU": 1}
        ],
        strategy="SPREAD"
    )
    ray.get(pg_spread.ready())
    print(f"✓ SPREAD placement group created: {pg_spread.id.hex()}")
    
    # Test placement group table
    table = placement_group_table()
    print(f"✓ Placement group table has {len(table)} groups")
    for pg_info in table.values():
        print(f"  - {pg_info['name']}: {pg_info['state']}, {len(pg_info['bundles'])} bundles")
    
    # Test scheduling with placement group
    @ray.remote(num_cpus=2)
    def task_in_pg():
        return "task in placement group"
    
    result = ray.get(task_in_pg.options(
        scheduling_strategy=PlacementGroupSchedulingStrategy(placement_group=pg_pack)
    ).remote())
    print(f"✓ Task scheduled in placement group: {result}")
    
    # Cleanup
    ray.util.remove_placement_group(pg_pack)
    ray.util.remove_placement_group(pg_spread)
    
    ray.shutdown()
    print("✓ Placement group test passed")
    return True

def test_gang_scheduling():
    """Test gang scheduling simulation"""
    print("\n=== Testing Gang Scheduling ===")
    ray.init(num_cpus=8, num_gpus=4, ignore_reinit_error=True)
    
    from ray.util.placement_group import placement_group
    from ray.util.scheduling_strategies import PlacementGroupSchedulingStrategy
    
    # Simulate gang-scheduling 4 GPU workers
    gpu_pg = placement_group([
        {"CPU": 1, "GPU": 1},
        {"CPU": 1, "GPU": 1},
        {"CPU": 1, "GPU": 1},
        {"CPU": 1, "GPU": 1}
    ], strategy="STRICT_PACK")
    
    ray.get(gpu_pg.ready())
    print("✓ GPU placement group ready (gang scheduled)")
    
    # Create actors in the placement group
    @ray.remote(num_cpus=1, num_gpus=1)
    class GPUWorker:
        def __init__(self, worker_id):
            self.worker_id = worker_id
            self.tasks_completed = 0
        
        def compute(self):
            self.tasks_completed += 1
            return f"Worker {self.worker_id} completed {self.tasks_completed} tasks"
    
    workers = [
        GPUWorker.options(
            scheduling_strategy=PlacementGroupSchedulingStrategy(
                placement_group=gpu_pg,
                placement_group_bundle_index=i
            )
        ).remote(i)
        for i in range(4)
    ]
    
    print("✓ 4 GPU workers created in placement group")
    
    # Run tasks on all workers
    futures = [worker.compute.remote() for worker in workers]
    results = ray.get(futures)
    print(f"✓ All workers completed: {results}")
    
    ray.util.remove_placement_group(gpu_pg)
    ray.shutdown()
    print("✓ Gang scheduling test passed")
    return True

if __name__ == "__main__":
    try:
        test_resource_model()
        test_placement_groups()
        test_gang_scheduling()
        print("\n" + "="*60)
        print("✓ ALL TESTS PASSED")
        print("="*60)
    except Exception as e:
        print(f"\n✗ Test failed: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
