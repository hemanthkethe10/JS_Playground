/**
 * SEQUENTIAL vs PARALLEL COMPARISON
 * 
 * This example clearly demonstrates the performance difference
 * between sequential and parallel execution of CPU-intensive tasks.
 */

import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// CPU-intensive function (calculates Fibonacci)
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// ============================================
// MAIN THREAD
// ============================================
if (isMainThread) {
    const TASK_VALUE = 40; // fib(40) takes ~1-2 seconds
    const NUM_TASKS = 8;
    
    console.log('════════════════════════════════════════════════════════════');
    console.log('         SEQUENTIAL vs PARALLEL EXECUTION COMPARISON');
    console.log('════════════════════════════════════════════════════════════\n');
    console.log(`Task: Calculate fibonacci(${TASK_VALUE}) × ${NUM_TASKS} times`);
    console.log(`Available CPU Cores: ${os.cpus().length}\n`);
    
    // ========================================
    // SEQUENTIAL EXECUTION
    // ========================================
    async function runSequential() {
        console.log('─────────────────────────────────────────');
        console.log('SEQUENTIAL EXECUTION (Single Thread)');
        console.log('─────────────────────────────────────────');
        console.log('Timeline: [Task 1]→[Task 2]→[Task 3]→...\n');
        
        const startTime = Date.now();
        const results = [];
        
        for (let i = 0; i < NUM_TASKS; i++) {
            const taskStart = Date.now();
            const result = fibonacci(TASK_VALUE);
            const taskEnd = Date.now();
            results.push(result);
            console.log(`  Task ${i + 1}: fib(${TASK_VALUE}) = ${result} (${taskEnd - taskStart}ms)`);
        }
        
        const totalTime = Date.now() - startTime;
        console.log(`\n  ⏱  Total Sequential Time: ${totalTime}ms\n`);
        return totalTime;
    }
    
    // ========================================
    // PARALLEL EXECUTION
    // ========================================
    async function runParallel() {
        console.log('─────────────────────────────────────────');
        console.log('PARALLEL EXECUTION (Worker Threads)');
        console.log('─────────────────────────────────────────');
        console.log('Timeline: [Task 1][Task 2][Task 3]... (concurrent)\n');
        
        const startTime = Date.now();
        
        // Create workers for all tasks
        const workerPromises = Array.from({ length: NUM_TASKS }, (_, i) => {
            return new Promise((resolve, reject) => {
                const worker = new Worker(__filename, {
                    workerData: { 
                        taskId: i + 1, 
                        value: TASK_VALUE 
                    }
                });
                
                worker.on('message', (result) => {
                    console.log(`  Task ${result.taskId}: fib(${TASK_VALUE}) = ${result.result} (${result.time}ms)`);
                    resolve(result);
                });
                
                worker.on('error', reject);
            });
        });
        
        await Promise.all(workerPromises);
        
        const totalTime = Date.now() - startTime;
        console.log(`\n  ⏱  Total Parallel Time: ${totalTime}ms\n`);
        return totalTime;
    }
    
    // ========================================
    // RUN COMPARISON
    // ========================================
    async function runComparison() {
        const sequentialTime = await runSequential();
        const parallelTime = await runParallel();
        
        const speedup = (sequentialTime / parallelTime).toFixed(2);
        
        console.log('════════════════════════════════════════════════════════════');
        console.log('                         SUMMARY');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`  Sequential Time: ${sequentialTime}ms`);
        console.log(`  Parallel Time:   ${parallelTime}ms`);
        console.log(`  Speedup:         ${speedup}x faster`);
        console.log(`  Time Saved:      ${sequentialTime - parallelTime}ms`);
        console.log('════════════════════════════════════════════════════════════\n');
        
        // Visual representation
        const seqBar = '█'.repeat(Math.round(sequentialTime / 100));
        const parBar = '█'.repeat(Math.round(parallelTime / 100));
        
        console.log('Visual Comparison (each █ = ~100ms):');
        console.log(`  Sequential: ${seqBar}`);
        console.log(`  Parallel:   ${parBar}`);
    }
    
    runComparison();
    
} 
// ============================================
// WORKER THREAD
// ============================================
else {
    const { taskId, value } = workerData;
    const startTime = Date.now();
    
    const result = fibonacci(value);
    
    const endTime = Date.now();
    
    parentPort.postMessage({
        taskId,
        result,
        time: endTime - startTime
    });
}

