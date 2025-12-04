/**
 * gRPC Server Implementation
 * 
 * This server demonstrates all four RPC patterns:
 * 1. Unary RPC - Simple request/response
 * 2. Server Streaming - Server sends multiple responses
 * 3. Client Streaming - Client sends multiple requests
 * 4. Bidirectional Streaming - Both sides stream
 */

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proto file configuration
const PROTO_PATH = path.join(__dirname, 'proto', 'learning.proto');

// Load proto file with options
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,      // Keep field names as-is (no camelCase conversion)
  longs: String,       // Convert long values to strings
  enums: String,       // Convert enums to strings
  defaults: true,      // Include default values
  oneofs: true         // Include virtual oneof properties
});

// Create gRPC package object
const learningProto = grpc.loadPackageDefinition(packageDefinition).learning;

// ============================================
// IN-MEMORY DATA STORE
// ============================================

// Sample users database
const users = {
  1: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', is_active: true },
  2: { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', is_active: true },
  3: { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Designer', is_active: false },
};

// Todos storage
let todos = [];
let todoIdCounter = 1;

// Greetings in different languages
const greetings = {
  en: 'Hello',
  es: 'Hola',
  fr: 'Bonjour',
  de: 'Guten Tag',
  it: 'Ciao',
  pt: 'Olá',
  ja: 'こんにちは',
  ko: '안녕하세요',
};

// ============================================
// GREETING SERVICE IMPLEMENTATIONS
// ============================================

/**
 * Unary RPC: SayHello
 * Receives a name and language, returns a greeting
 */
function sayHello(call, callback) {
  const { name, language } = call.request;
  const greeting = greetings[language] || greetings['en'];
  
  console.log(`📨 SayHello called: name=${name}, language=${language}`);
  
  callback(null, {
    greeting: `${greeting}, ${name}! Welcome to gRPC.`,
    timestamp: new Date().toISOString()
  });
}

/**
 * Unary RPC: GetUser
 * Retrieves user information by ID
 */
function getUser(call, callback) {
  const { user_id } = call.request;
  
  console.log(`📨 GetUser called: user_id=${user_id}`);
  
  const user = users[user_id];
  
  if (!user) {
    // Return gRPC error status
    callback({
      code: grpc.status.NOT_FOUND,
      message: `User with ID ${user_id} not found`
    });
    return;
  }
  
  callback(null, user);
}

// ============================================
// CALCULATOR SERVICE IMPLEMENTATIONS
// ============================================

/**
 * Unary RPC: Add
 * Simple addition of two numbers
 */
function add(call, callback) {
  const { num1, num2 } = call.request;
  const result = num1 + num2;
  
  console.log(`📨 Add called: ${num1} + ${num2} = ${result}`);
  
  callback(null, { result });
}

/**
 * Server Streaming RPC: GenerateSequence
 * Generates a sequence of numbers and streams them to the client
 */
function generateSequence(call) {
  const { start, end, step } = call.request;
  const actualStep = step || 1;
  
  console.log(`📨 GenerateSequence called: start=${start}, end=${end}, step=${actualStep}`);
  
  let index = 0;
  
  for (let num = start; num <= end; num += actualStep) {
    // Write each number to the stream
    call.write({
      number: num,
      index: index++
    });
    
    console.log(`  📤 Streaming number: ${num}`);
  }
  
  // End the stream
  call.end();
  console.log('  ✅ Stream ended');
}

/**
 * Client Streaming RPC: CalculateSum
 * Receives a stream of numbers and returns their sum
 */
function calculateSum(call, callback) {
  console.log(`📨 CalculateSum started - waiting for numbers...`);
  
  let sum = 0;
  let count = 0;
  
  // Handle incoming data
  call.on('data', (request) => {
    const { number } = request;
    sum += number;
    count++;
    console.log(`  📥 Received number: ${number} (running sum: ${sum})`);
  });
  
  // Handle stream end
  call.on('end', () => {
    const average = count > 0 ? sum / count : 0;
    console.log(`  ✅ Client stream ended. Sum: ${sum}, Count: ${count}, Avg: ${average}`);
    
    callback(null, {
      sum,
      count,
      average
    });
  });
  
  // Handle errors
  call.on('error', (error) => {
    console.error('  ❌ Error in client stream:', error.message);
  });
}

/**
 * Bidirectional Streaming RPC: RealTimeCalculator
 * Receives calculation requests and immediately returns results
 */
function realTimeCalculator(call) {
  console.log(`📨 RealTimeCalculator started - bidirectional streaming active`);
  
  call.on('data', (request) => {
    const { operation, num1, num2 } = request;
    let result = 0;
    let error = '';
    
    console.log(`  📥 Received: ${num1} ${operation} ${num2}`);
    
    switch (operation.toLowerCase()) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        if (num2 === 0) {
          error = 'Division by zero';
        } else {
          result = num1 / num2;
        }
        break;
      default:
        error = `Unknown operation: ${operation}`;
    }
    
    // Send response immediately
    call.write({
      operation,
      result,
      error
    });
    
    console.log(`  📤 Sent result: ${error || result}`);
  });
  
  call.on('end', () => {
    console.log('  ✅ Bidirectional stream ended');
    call.end();
  });
  
  call.on('error', (error) => {
    console.error('  ❌ Error in bidirectional stream:', error.message);
  });
}

// ============================================
// TODO SERVICE IMPLEMENTATIONS
// ============================================

/**
 * Unary RPC: CreateTodo
 */
function createTodo(call, callback) {
  const { title, description, priority } = call.request;
  
  console.log(`📨 CreateTodo called: title="${title}"`);
  
  const now = new Date().toISOString();
  const todo = {
    id: todoIdCounter++,
    title,
    description: description || '',
    completed: false,
    priority: priority || 'LOW',
    created_at: now,
    updated_at: now
  };
  
  todos.push(todo);
  
  callback(null, { todo });
}

/**
 * Unary RPC: GetTodo
 */
function getTodo(call, callback) {
  const { id } = call.request;
  
  console.log(`📨 GetTodo called: id=${id}`);
  
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    callback({
      code: grpc.status.NOT_FOUND,
      message: `Todo with ID ${id} not found`
    });
    return;
  }
  
  callback(null, { todo });
}

/**
 * Server Streaming RPC: ListTodos
 * Streams all todos matching the filter criteria
 */
function listTodos(call) {
  const { completed_only, pending_only, priority_filter } = call.request;
  
  console.log(`📨 ListTodos called: completed_only=${completed_only}, pending_only=${pending_only}`);
  
  let filteredTodos = [...todos];
  
  // Apply filters
  if (completed_only) {
    filteredTodos = filteredTodos.filter(t => t.completed);
  }
  if (pending_only) {
    filteredTodos = filteredTodos.filter(t => !t.completed);
  }
  if (priority_filter && priority_filter !== 'LOW') {
    filteredTodos = filteredTodos.filter(t => t.priority === priority_filter);
  }
  
  // Stream each todo
  for (const todo of filteredTodos) {
    call.write({ todo });
    console.log(`  📤 Streaming todo: ${todo.title}`);
  }
  
  call.end();
  console.log(`  ✅ Streamed ${filteredTodos.length} todos`);
}

/**
 * Unary RPC: UpdateTodo
 */
function updateTodo(call, callback) {
  const { id, title, description, completed, priority } = call.request;
  
  console.log(`📨 UpdateTodo called: id=${id}`);
  
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    callback({
      code: grpc.status.NOT_FOUND,
      message: `Todo with ID ${id} not found`
    });
    return;
  }
  
  const todo = todos[todoIndex];
  
  // Update fields if provided
  if (title) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  if (priority) todo.priority = priority;
  todo.updated_at = new Date().toISOString();
  
  callback(null, { todo });
}

/**
 * Unary RPC: DeleteTodo
 */
function deleteTodo(call, callback) {
  const { id } = call.request;
  
  console.log(`📨 DeleteTodo called: id=${id}`);
  
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    callback(null, {
      success: false,
      message: `Todo with ID ${id} not found`
    });
    return;
  }
  
  todos.splice(todoIndex, 1);
  
  callback(null, {
    success: true,
    message: `Todo ${id} deleted successfully`
  });
}

// ============================================
// SERVER STARTUP
// ============================================

function main() {
  const server = new grpc.Server();
  
  // Register all services
  server.addService(learningProto.GreetingService.service, {
    sayHello,
    getUser
  });
  
  server.addService(learningProto.CalculatorService.service, {
    add,
    generateSequence,
    calculateSum,
    realTimeCalculator
  });
  
  server.addService(learningProto.TodoService.service, {
    createTodo,
    getTodo,
    listTodos,
    updateTodo,
    deleteTodo
  });
  
  // Start server
  const PORT = 'localhost:50051';
  
  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('❌ Failed to start server:', error);
      return;
    }
    
    console.log('╔════════════════════════════════════════════╗');
    console.log('║     🚀 gRPC Learning Server Started!       ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  📡 Listening on port ${port}              ║`);
    console.log('║                                            ║');
    console.log('║  Available Services:                       ║');
    console.log('║  ├─ GreetingService                        ║');
    console.log('║  │  ├─ SayHello (Unary)                    ║');
    console.log('║  │  └─ GetUser (Unary)                     ║');
    console.log('║  ├─ CalculatorService                      ║');
    console.log('║  │  ├─ Add (Unary)                         ║');
    console.log('║  │  ├─ GenerateSequence (Server Stream)    ║');
    console.log('║  │  ├─ CalculateSum (Client Stream)        ║');
    console.log('║  │  └─ RealTimeCalculator (Bidirectional)  ║');
    console.log('║  └─ TodoService                            ║');
    console.log('║     ├─ CreateTodo (Unary)                  ║');
    console.log('║     ├─ GetTodo (Unary)                     ║');
    console.log('║     ├─ ListTodos (Server Stream)           ║');
    console.log('║     ├─ UpdateTodo (Unary)                  ║');
    console.log('║     └─ DeleteTodo (Unary)                  ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n📋 Waiting for client connections...\n');
  });
}

main();

