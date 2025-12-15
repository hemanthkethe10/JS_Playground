/**
 * WORKER THREADS WEB DEMO SERVER
 * 
 * Endpoints:
 * - GET /                    → Serve the demo page
 * - POST /api/sequential     → Run tasks sequentially
 * - POST /api/parallel       → Run tasks in parallel with workers
 * - GET /api/status/:taskId  → Poll task status (for real-time monitoring)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Store for tracking task progress
const taskStore = new Map();

// Fibonacci function for sequential execution
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate unique task ID
function generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // CORS headers for dev tools visibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    
    // Serve the HTML page
    if (url.pathname === '/' && req.method === 'GET') {
        const htmlPath = path.join(__dirname, 'demo.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }
    
    // Sequential execution endpoint
    if (url.pathname === '/api/sequential' && req.method === 'POST') {
        const body = await getBody(req);
        const { fibValue = 40, taskCount = 4 } = JSON.parse(body || '{}');
        
        const taskId = generateTaskId();
        const startTime = Date.now();
        
        // Initialize task tracking
        taskStore.set(taskId, {
            status: 'running',
            type: 'sequential',
            total: taskCount,
            completed: 0,
            results: [],
            startTime
        });
        
        // Send immediate response with taskId
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ taskId, message: 'Task started' }));
        
        // Run sequentially (non-blocking via setImmediate)
        runSequential(taskId, fibValue, taskCount);
        return;
    }
    
    // Parallel execution endpoint
    if (url.pathname === '/api/parallel' && req.method === 'POST') {
        const body = await getBody(req);
        const { fibValue = 40, taskCount = 4 } = JSON.parse(body || '{}');
        
        const taskId = generateTaskId();
        const startTime = Date.now();
        
        // Initialize task tracking
        taskStore.set(taskId, {
            status: 'running',
            type: 'parallel',
            total: taskCount,
            completed: 0,
            results: [],
            startTime
        });
        
        // Send immediate response with taskId
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ taskId, message: 'Task started' }));
        
        // Run in parallel with workers
        runParallel(taskId, fibValue, taskCount);
        return;
    }
    
    // Status polling endpoint
    if (url.pathname.startsWith('/api/status/') && req.method === 'GET') {
        const taskId = url.pathname.split('/').pop();
        const task = taskStore.get(taskId);
        
        if (!task) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Task not found' }));
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
        return;
    }
    
    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

// Helper to get request body
function getBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
    });
}

// Run tasks sequentially
async function runSequential(taskId, fibValue, taskCount) {
    const task = taskStore.get(taskId);
    
    for (let i = 0; i < taskCount; i++) {
        const taskStart = Date.now();
        
        // Use setImmediate to not block the event loop entirely
        await new Promise(resolve => {
            setImmediate(() => {
                const result = fibonacci(fibValue);
                const taskTime = Date.now() - taskStart;
                
                task.completed++;
                task.results.push({
                    taskNum: i + 1,
                    result,
                    time: taskTime
                });
                
                resolve();
            });
        });
    }
    
    task.status = 'completed';
    task.totalTime = Date.now() - task.startTime;
}

// Run tasks in parallel with workers
async function runParallel(taskId, fibValue, taskCount) {
    const task = taskStore.get(taskId);
    
    const workerPromises = [];
    
    for (let i = 0; i < taskCount; i++) {
        const promise = new Promise((resolve, reject) => {
            const worker = new Worker(path.join(__dirname, 'compute-worker.js'), {
                workerData: {
                    taskNum: i + 1,
                    fibValue
                }
            });
            
            worker.on('message', (result) => {
                task.completed++;
                task.results.push(result);
                resolve(result);
            });
            
            worker.on('error', reject);
        });
        
        workerPromises.push(promise);
    }
    
    await Promise.all(workerPromises);
    
    task.status = 'completed';
    task.totalTime = Date.now() - task.startTime;
}

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         WORKER THREADS WEB DEMO SERVER                     ║
╠════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                  ║
║                                                            ║
║  Open in browser and use Developer Tools to monitor:       ║
║  • Network tab: See API requests and polling               ║
║  • Console tab: See logs and timing                        ║
╚════════════════════════════════════════════════════════════╝
    `);
});

