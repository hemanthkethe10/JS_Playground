/**
 * TASK WORKER
 * 
 * This worker handles various CPU-intensive tasks.
 * It receives tasks from the main thread and returns results.
 */

import { parentPort, workerData } from 'worker_threads';

const { workerId } = workerData;

console.log(`Worker ${workerId} initialized and ready`);

// Task handlers
const taskHandlers = {
    fibonacci: (n) => {
        // CPU-intensive recursive fibonacci
        function fib(num) {
            if (num <= 1) return num;
            return fib(num - 1) + fib(num - 2);
        }
        return fib(n);
    },
    
    primeCheck: (n) => {
        // Check if number is prime
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    },
    
    factorial: (n) => {
        let result = 1n; // BigInt for large numbers
        for (let i = 2n; i <= BigInt(n); i++) {
            result *= i;
        }
        return result.toString();
    },
    
    sumRange: ({ start, end }) => {
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += i;
        }
        return sum;
    }
};

// Listen for tasks from main thread
parentPort.on('message', (task) => {
    const startTime = Date.now();
    
    const { taskId, type, data } = task;
    
    let result;
    if (taskHandlers[type]) {
        result = taskHandlers[type](data);
    } else {
        result = { error: `Unknown task type: ${type}` };
    }
    
    const executionTime = Date.now() - startTime;
    
    // Send result back to main thread
    parentPort.postMessage({
        taskId,
        type,
        input: data,
        result,
        workerId,
        executionTime
    });
});

