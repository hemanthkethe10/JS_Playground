const { parentPort } = require('worker_threads');

// Listen for messages from the main thread
parentPort.on('message', (data) => {
  
  // Process the message (example: append a string)
  const result = data + ' processed';
  setTimeout(() => {
    const currentTime = new Date().toISOString();
    console.log('Message from main:', data , currentTime);
  }, 10000); 
  if (data === 'stop') {
    parentPort.close();
  }
  
  // Send the processed data back to the main thread
  parentPort.postMessage(result);
});
