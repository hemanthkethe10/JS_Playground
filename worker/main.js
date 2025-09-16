const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js');

worker.on('message', (data) => {
    const currentTime = new Date().toISOString();
    console.log('Message from worker:', data, currentTime);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

worker.on('exit', (code) => {
  console.log('Worker stopped with exit code', code);
});


for (let i = 0; i < 10; i++) {
// Send a message to the worker
worker.postMessage(`Hello, Worker!- ${i}`);
}

for (let i = 0; i < 10; i++) {
    // Send a message to the worker
    worker.postMessage(`Hello, Worker from second loop!- ${i}`);
}

worker.postMessage('stop');
