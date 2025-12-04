/**
 * gRPC Client Implementation
 * 
 * This client demonstrates how to call all four RPC patterns:
 * 1. Unary RPC - Simple request/response
 * 2. Server Streaming - Receive multiple responses
 * 3. Client Streaming - Send multiple requests
 * 4. Bidirectional Streaming - Send and receive simultaneously
 */

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto file
const PROTO_PATH = path.join(__dirname, 'proto', 'learning.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const learningProto = grpc.loadPackageDefinition(packageDefinition).learning;

// Create service clients
const greetingClient = new learningProto.GreetingService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const calculatorClient = new learningProto.CalculatorService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const todoClient = new learningProto.TodoService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// ============================================
// HELPER FUNCTIONS
// ============================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function printHeader(title) {
  console.log('\n' + '═'.repeat(50));
  console.log(`  ${title}`);
  console.log('═'.repeat(50));
}

function printSubHeader(title) {
  console.log(`\n  📌 ${title}`);
  console.log('  ' + '─'.repeat(40));
}

// ============================================
// GREETING SERVICE EXAMPLES
// ============================================

async function demoSayHello() {
  printSubHeader('SayHello (Unary RPC)');
  
  const languages = [
    { name: 'World', language: 'en' },
    { name: 'Mundo', language: 'es' },
    { name: 'Monde', language: 'fr' },
    { name: 'Welt', language: 'de' },
  ];
  
  for (const request of languages) {
    await new Promise((resolve, reject) => {
      greetingClient.sayHello(request, (error, response) => {
        if (error) {
          console.log(`  ❌ Error: ${error.message}`);
          reject(error);
          return;
        }
        console.log(`  ✅ ${response.greeting}`);
        console.log(`     Timestamp: ${response.timestamp}`);
        resolve();
      });
    });
  }
}

async function demoGetUser() {
  printSubHeader('GetUser (Unary RPC)');
  
  const userIds = [1, 2, 3, 99]; // 99 doesn't exist
  
  for (const user_id of userIds) {
    await new Promise((resolve) => {
      greetingClient.getUser({ user_id }, (error, response) => {
        if (error) {
          console.log(`  ❌ User ${user_id}: ${error.message}`);
        } else {
          console.log(`  ✅ User ${user_id}: ${response.name} (${response.email})`);
          console.log(`     Role: ${response.role}, Active: ${response.is_active}`);
        }
        resolve();
      });
    });
  }
}

// ============================================
// CALCULATOR SERVICE EXAMPLES
// ============================================

async function demoAdd() {
  printSubHeader('Add (Unary RPC)');
  
  const calculations = [
    { num1: 10, num2: 20 },
    { num1: 100, num2: 200 },
    { num1: 3.14, num2: 2.86 },
  ];
  
  for (const calc of calculations) {
    await new Promise((resolve, reject) => {
      calculatorClient.add(calc, (error, response) => {
        if (error) {
          console.log(`  ❌ Error: ${error.message}`);
          reject(error);
          return;
        }
        console.log(`  ✅ ${calc.num1} + ${calc.num2} = ${response.result}`);
        resolve();
      });
    });
  }
}

async function demoServerStreaming() {
  printSubHeader('GenerateSequence (Server Streaming RPC)');
  
  console.log('  📡 Requesting sequence from 1 to 10 with step 2...\n');
  
  return new Promise((resolve, reject) => {
    const call = calculatorClient.generateSequence({
      start: 1,
      end: 10,
      step: 2
    });
    
    call.on('data', (response) => {
      console.log(`  📥 Received: index=${response.index}, number=${response.number}`);
    });
    
    call.on('end', () => {
      console.log('  ✅ Server stream completed');
      resolve();
    });
    
    call.on('error', (error) => {
      console.log(`  ❌ Error: ${error.message}`);
      reject(error);
    });
  });
}

async function demoClientStreaming() {
  printSubHeader('CalculateSum (Client Streaming RPC)');
  
  console.log('  📡 Streaming numbers to calculate sum...\n');
  
  return new Promise((resolve, reject) => {
    const call = calculatorClient.calculateSum((error, response) => {
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      console.log('\n  📊 Results:');
      console.log(`     Sum: ${response.sum}`);
      console.log(`     Count: ${response.count}`);
      console.log(`     Average: ${response.average}`);
      resolve();
    });
    
    // Stream numbers to the server
    const numbers = [10, 20, 30, 40, 50];
    
    (async () => {
      for (const num of numbers) {
        console.log(`  📤 Sending: ${num}`);
        call.write({ number: num });
        await sleep(200); // Small delay to demonstrate streaming
      }
      
      // End the client stream
      call.end();
      console.log('  ✅ Client stream ended');
    })();
  });
}

async function demoBidirectionalStreaming() {
  printSubHeader('RealTimeCalculator (Bidirectional Streaming RPC)');
  
  console.log('  📡 Starting bidirectional stream...\n');
  
  return new Promise((resolve, reject) => {
    const call = calculatorClient.realTimeCalculator();
    
    // Handle incoming responses
    call.on('data', (response) => {
      if (response.error) {
        console.log(`  📥 Error: ${response.error}`);
      } else {
        console.log(`  📥 Result: ${response.operation} = ${response.result}`);
      }
    });
    
    call.on('end', () => {
      console.log('  ✅ Bidirectional stream completed');
      resolve();
    });
    
    call.on('error', (error) => {
      console.log(`  ❌ Error: ${error.message}`);
      reject(error);
    });
    
    // Send calculation requests
    const operations = [
      { operation: 'add', num1: 10, num2: 5 },
      { operation: 'subtract', num1: 100, num2: 37 },
      { operation: 'multiply', num1: 7, num2: 8 },
      { operation: 'divide', num1: 100, num2: 4 },
      { operation: 'divide', num1: 10, num2: 0 }, // Division by zero
    ];
    
    (async () => {
      for (const op of operations) {
        console.log(`  📤 Sending: ${op.num1} ${op.operation} ${op.num2}`);
        call.write(op);
        await sleep(300);
      }
      
      call.end();
    })();
  });
}

// ============================================
// TODO SERVICE EXAMPLES
// ============================================

async function demoTodoService() {
  printSubHeader('Todo Service (CRUD Operations)');
  
  // Create todos
  console.log('\n  📝 Creating todos...');
  
  const todosToCreate = [
    { title: 'Learn gRPC basics', description: 'Understand proto files and message types', priority: 'HIGH' },
    { title: 'Implement server', description: 'Create gRPC server with all RPC types', priority: 'HIGH' },
    { title: 'Build client', description: 'Test all service methods', priority: 'MEDIUM' },
    { title: 'Add documentation', description: 'Write README and comments', priority: 'LOW' },
  ];
  
  const createdTodos = [];
  
  for (const todoData of todosToCreate) {
    await new Promise((resolve, reject) => {
      todoClient.createTodo(todoData, (error, response) => {
        if (error) {
          console.log(`  ❌ Error creating todo: ${error.message}`);
          reject(error);
          return;
        }
        const todo = response.todo;
        createdTodos.push(todo);
        console.log(`  ✅ Created: [${todo.id}] ${todo.title} (${todo.priority})`);
        resolve();
      });
    });
  }
  
  // Get a specific todo
  console.log('\n  🔍 Getting todo by ID...');
  
  await new Promise((resolve) => {
    todoClient.getTodo({ id: 1 }, (error, response) => {
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
      } else {
        const todo = response.todo;
        console.log(`  ✅ Found: [${todo.id}] ${todo.title}`);
        console.log(`     Description: ${todo.description}`);
        console.log(`     Priority: ${todo.priority}, Completed: ${todo.completed}`);
      }
      resolve();
    });
  });
  
  // Update a todo
  console.log('\n  ✏️  Updating todo...');
  
  await new Promise((resolve) => {
    todoClient.updateTodo({
      id: 1,
      completed: true,
      description: 'Understood proto files, message types, and all RPC patterns!'
    }, (error, response) => {
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
      } else {
        const todo = response.todo;
        console.log(`  ✅ Updated: [${todo.id}] ${todo.title}`);
        console.log(`     Completed: ${todo.completed}`);
        console.log(`     Updated at: ${todo.updated_at}`);
      }
      resolve();
    });
  });
  
  // List all todos (server streaming)
  console.log('\n  📋 Listing all todos (streaming)...');
  
  await new Promise((resolve, reject) => {
    const call = todoClient.listTodos({});
    
    call.on('data', (response) => {
      const todo = response.todo;
      const status = todo.completed ? '✓' : '○';
      console.log(`  📥 [${status}] [${todo.id}] ${todo.title} (${todo.priority})`);
    });
    
    call.on('end', () => {
      console.log('  ✅ Finished listing todos');
      resolve();
    });
    
    call.on('error', (error) => {
      console.log(`  ❌ Error: ${error.message}`);
      reject(error);
    });
  });
  
  // Delete a todo
  console.log('\n  🗑️  Deleting todo...');
  
  await new Promise((resolve) => {
    todoClient.deleteTodo({ id: 4 }, (error, response) => {
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
      } else {
        console.log(`  ✅ ${response.message}`);
      }
      resolve();
    });
  });
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║      🎓 gRPC Learning Client - Demo Suite          ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    // Greeting Service Demos
    printHeader('🙋 GREETING SERVICE');
    await demoSayHello();
    await demoGetUser();
    
    // Calculator Service Demos
    printHeader('🧮 CALCULATOR SERVICE');
    await demoAdd();
    await demoServerStreaming();
    await demoClientStreaming();
    await demoBidirectionalStreaming();
    
    // Todo Service Demos
    printHeader('📝 TODO SERVICE');
    await demoTodoService();
    
    // Summary
    printHeader('🎉 ALL DEMOS COMPLETED!');
    console.log(`
  You've seen examples of:
  
  ✅ Unary RPC
     - Simple request/response (SayHello, GetUser, Add)
     
  ✅ Server Streaming RPC
     - Server sends multiple responses (GenerateSequence, ListTodos)
     
  ✅ Client Streaming RPC
     - Client sends multiple requests (CalculateSum)
     
  ✅ Bidirectional Streaming RPC
     - Both sides stream simultaneously (RealTimeCalculator)
     
  ✅ Error Handling
     - gRPC status codes (NOT_FOUND for missing users/todos)
     
  ✅ Complex Messages
     - Nested messages, enums, repeated fields
`);
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.log('\n💡 Make sure the server is running: node server.js');
  }
  
  // Close the connections
  process.exit(0);
}

main();

