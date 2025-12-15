/**
 * COMPUTE WORKER
 * Handles CPU-intensive fibonacci calculation
 */

import { parentPort, workerData } from 'worker_threads';

const { taskNum, fibValue } = workerData;

// CPU-intensive fibonacci
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const startTime = Date.now();
const result = fibonacci(fibValue);
const executionTime = Date.now() - startTime;

// Send result back to main thread
parentPort.postMessage({
    taskNum,
    fibValue,
    result,
    time: executionTime,
    workerId: process.pid
});

