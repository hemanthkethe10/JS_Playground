/**
 * WORKER POOL PATTERN
 * 
 * This example shows how to:
 * 1. Create a reusable pool of workers
 * 2. Queue tasks and distribute them to available workers
 * 3. Handle multiple independent tasks efficiently
 * 
 * Use Case: Processing many independent tasks (image processing, 
 * data transformation, cryptography, etc.)
 */

import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// WORKER POOL CLASS
// ============================================
class WorkerPool {
    constructor(workerScript, poolSize = os.cpus().length) {
        this.workerScript = workerScript;
        this.poolSize = poolSize;
        this.workers = [];
        this.availableWorkers = [];
        this.taskQueue = [];
        this.activeCount = 0;
        
        console.log(`Creating worker pool with ${poolSize} workers...\n`);
        this._initializeWorkers();
    }
    
    _initializeWorkers() {
        for (let i = 0; i < this.poolSize; i++) {
            const worker = new Worker(this.workerScript, {
                workerData: { workerId: i + 1 }
            });
            
            worker.id = i + 1;
            worker.busy = false;
            
            worker.on('message', (result) => {
                this._handleWorkerMessage(worker, result);
            });
            
            worker.on('error', (err) => {
                console.error(`Worker ${worker.id} error:`, err);
            });
            
            this.workers.push(worker);
            this.availableWorkers.push(worker);
        }
    }
    
    _handleWorkerMessage(worker, result) {
        worker.busy = false;
        this.activeCount--;
        
        // Resolve the pending promise for this task
        if (worker.currentResolve) {
            worker.currentResolve(result);
            worker.currentResolve = null;
        }
        
        // Check if there are queued tasks
        if (this.taskQueue.length > 0) {
            const nextTask = this.taskQueue.shift();
            this._assignTask(worker, nextTask);
        } else {
            this.availableWorkers.push(worker);
        }
    }
    
    _assignTask(worker, { task, resolve, reject }) {
        worker.busy = true;
        worker.currentResolve = resolve;
        this.activeCount++;
        
        worker.postMessage(task);
    }
    
    // Execute a single task
    exec(task) {
        return new Promise((resolve, reject) => {
            if (this.availableWorkers.length > 0) {
                const worker = this.availableWorkers.pop();
                this._assignTask(worker, { task, resolve, reject });
            } else {
                // All workers busy, queue the task
                this.taskQueue.push({ task, resolve, reject });
            }
        });
    }
    
    // Execute multiple tasks in parallel
    async execAll(tasks) {
        return Promise.all(tasks.map(task => this.exec(task)));
    }
    
    // Terminate all workers
    terminate() {
        console.log('\nTerminating worker pool...');
        this.workers.forEach(worker => worker.terminate());
    }
    
    get status() {
        return {
            total: this.poolSize,
            active: this.activeCount,
            available: this.availableWorkers.length,
            queued: this.taskQueue.length
        };
    }
}

// ============================================
// MAIN THREAD - DEMO
// ============================================
if (isMainThread) {
    console.log('========================================');
    console.log('WORKER POOL PATTERN DEMO');
    console.log('========================================\n');
    
    // Create pool using the task-worker.js file
    const pool = new WorkerPool(path.join(__dirname, 'task-worker.js'), 4);
    
    // Create 20 tasks (more than workers to show queuing)
    const tasks = Array.from({ length: 20 }, (_, i) => ({
        taskId: i + 1,
        type: 'fibonacci',
        data: 35 + (i % 5) // Calculate fibonacci of 35-39
    }));
    
    console.log(`Submitting ${tasks.length} tasks to pool of ${pool.poolSize} workers...\n`);
    
    const startTime = Date.now();
    
    // Execute all tasks
    pool.execAll(tasks)
        .then((results) => {
            const endTime = Date.now();
            
            console.log('\n========================================');
            console.log('RESULTS');
            console.log('========================================');
            
            results.forEach(r => {
                console.log(`Task ${r.taskId}: fib(${r.input}) = ${r.result} (${r.executionTime}ms by Worker ${r.workerId})`);
            });
            
            console.log(`\nTotal Execution Time: ${endTime - startTime}ms`);
            console.log(`Average per task: ${((endTime - startTime) / tasks.length).toFixed(2)}ms`);
            
            pool.terminate();
        })
        .catch((err) => {
            console.error('Pool execution error:', err);
            pool.terminate();
        });
}

