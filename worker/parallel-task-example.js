/**
 * WORKER THREADS - PARALLEL TASK EXECUTION DEMO
 * 
 * This example demonstrates how to:
 * 1. Split a big task into smaller chunks
 * 2. Process chunks in parallel using worker threads
 * 3. Collect and combine results
 * 
 * Example Task: Calculate sum of numbers from 1 to 1 billion
 * - Sequential: Very slow (blocks event loop)
 * - Parallel: Split into chunks, each worker sums a range
 */

import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ============================================
// CONFIGURATION
// ============================================
const TOTAL_NUMBER = 1_000_000_000; // 1 billion
const NUM_WORKERS = os.cpus().length || 4; // Use all CPU cores (fallback to 4)

// ============================================
// MAIN THREAD CODE
// ============================================
if (isMainThread) {
    console.log('========================================');
    console.log('WORKER THREADS PARALLEL EXECUTION DEMO');
    console.log('========================================\n');
    console.log(`Total numbers to sum: ${TOTAL_NUMBER.toLocaleString()}`);
    console.log(`Number of CPU cores: ${NUM_WORKERS}`);
    console.log(`Each worker handles: ${Math.ceil(TOTAL_NUMBER / NUM_WORKERS).toLocaleString()} numbers\n`);

    // Track timing
    const startTime = Date.now();

    // Split the task into chunks
    const chunkSize = Math.ceil(TOTAL_NUMBER / NUM_WORKERS);
    const chunks = [];
    
    for (let i = 0; i < NUM_WORKERS; i++) {
        const start = i * chunkSize + 1;
        const end = Math.min((i + 1) * chunkSize, TOTAL_NUMBER);
        chunks.push({ start, end, workerId: i + 1 });
    }

    console.log('Task Distribution:');
    chunks.forEach(chunk => {
        console.log(`  Worker ${chunk.workerId}: Sum from ${chunk.start.toLocaleString()} to ${chunk.end.toLocaleString()}`);
    });
    console.log('\n--- Starting parallel execution ---\n');

    // Create workers and collect results
    const workerPromises = chunks.map(chunk => {
        return new Promise((resolve, reject) => {
            // Create a worker, passing this same file and chunk data
            const worker = new Worker(__filename, {
                workerData: chunk
            });

            worker.on('message', (result) => {
                console.log(`✓ Worker ${chunk.workerId} completed: partial sum = ${result.sum.toLocaleString()}`);
                resolve(result);
            });

            worker.on('error', (err) => {
                console.error(`✗ Worker ${chunk.workerId} error:`, err);
                reject(err);
            });

            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker ${chunk.workerId} stopped with exit code ${code}`));
                }
            });
        });
    });

    // Wait for all workers to complete
    Promise.all(workerPromises)
        .then((results) => {
            const endTime = Date.now();
            
            // Combine results from all workers (using BigInt for accuracy)
            const totalSum = results.reduce((acc, r) => acc + BigInt(r.sum), 0n);
            
            console.log('\n========================================');
            console.log('RESULTS');
            console.log('========================================');
            console.log(`Total Sum: ${totalSum.toLocaleString()}`);
            console.log(`Execution Time: ${endTime - startTime}ms`);
            console.log(`Workers Used: ${NUM_WORKERS}`);
            
            // Verify with formula: n(n+1)/2 using BigInt
            const n = BigInt(TOTAL_NUMBER);
            const expectedSum = (n * (n + 1n)) / 2n;
            console.log(`\nVerification (n*(n+1)/2): ${expectedSum.toLocaleString()}`);
            console.log(`Match: ${totalSum === expectedSum ? '✓ CORRECT' : '✗ MISMATCH'}`);
        })
        .catch((err) => {
            console.error('Error in parallel execution:', err);
        });

} 
// ============================================
// WORKER THREAD CODE
// ============================================
else {
    const { start, end, workerId } = workerData;
    
    // Use BigInt for accurate large number calculations
    let sum = 0n;
    for (let i = BigInt(start); i <= BigInt(end); i++) {
        sum += i;
    }
    
    // Send result back to main thread (convert to string for transfer)
    parentPort.postMessage({
        workerId,
        sum: sum.toString(),
        range: { start, end }
    });
}

