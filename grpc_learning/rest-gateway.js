/**
 * REST Gateway for gRPC Server
 * 
 * This creates a simple HTTP server that translates REST calls to gRPC.
 * Perfect for testing gRPC services from browsers or tools like Postman (HTTP mode).
 * 
 * Usage:
 *   1. Start the gRPC server: node server.js
 *   2. Start this gateway: node rest-gateway.js
 *   3. Access via browser: http://localhost:3000
 */

import http from 'http';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto
const PROTO_PATH = path.join(__dirname, 'proto', 'learning.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const learningProto = grpc.loadPackageDefinition(packageDefinition).learning;

// Create gRPC clients
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

// Promisify gRPC calls
function promisify(client, method) {
  return (request) => new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

// Stream collector
function collectStream(call) {
  return new Promise((resolve, reject) => {
    const results = [];
    call.on('data', (data) => results.push(data));
    call.on('end', () => resolve(results));
    call.on('error', reject);
  });
}

// HTML UI for browser testing
const HTML_UI = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>gRPC REST Gateway</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      color: #e4e4e7;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 2rem;
      background: linear-gradient(90deg, #00d9ff, #00ff88);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 217, 255, 0.2);
    }
    .card h2 {
      color: #00d9ff;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .card h2 .badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: #00ff88;
      color: #1a1a2e;
      font-weight: bold;
    }
    .card h2 .badge.stream { background: #ff6b6b; }
    .card p {
      color: #a1a1aa;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 0.75rem;
    }
    label {
      display: block;
      font-size: 0.75rem;
      color: #71717a;
      margin-bottom: 0.25rem;
    }
    input, select {
      width: 100%;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #e4e4e7;
      font-family: inherit;
      font-size: 0.9rem;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #00d9ff;
      box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.2);
    }
    button {
      width: 100%;
      padding: 0.6rem;
      background: linear-gradient(90deg, #00d9ff, #00ff88);
      border: none;
      border-radius: 6px;
      color: #1a1a2e;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: bold;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .result {
      margin-top: 1rem;
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 200px;
      overflow-y: auto;
      display: none;
    }
    .result.show { display: block; }
    .result.error { border-left: 3px solid #ff6b6b; }
    .result.success { border-left: 3px solid #00ff88; }
    .endpoints {
      text-align: center;
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    .endpoints h3 { color: #71717a; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .endpoints code {
      display: inline-block;
      background: rgba(0, 217, 255, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      margin: 0.25rem;
      font-size: 0.75rem;
    }
  </style>
</head>
<body>
  <h1>🚀 gRPC REST Gateway</h1>
  
  <div class="container">
    <!-- SayHello -->
    <div class="card">
      <h2>👋 SayHello <span class="badge">UNARY</span></h2>
      <p>Get a greeting in different languages</p>
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="hello-name" value="World" />
      </div>
      <div class="form-group">
        <label>Language</label>
        <select id="hello-lang">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
        </select>
      </div>
      <button onclick="callSayHello()">Send Request</button>
      <div class="result" id="hello-result"></div>
    </div>

    <!-- GetUser -->
    <div class="card">
      <h2>👤 GetUser <span class="badge">UNARY</span></h2>
      <p>Retrieve user information by ID</p>
      <div class="form-group">
        <label>User ID (try 1, 2, 3, or 99)</label>
        <input type="number" id="user-id" value="1" min="1" />
      </div>
      <button onclick="callGetUser()">Send Request</button>
      <div class="result" id="user-result"></div>
    </div>

    <!-- Add -->
    <div class="card">
      <h2>➕ Add <span class="badge">UNARY</span></h2>
      <p>Add two numbers together</p>
      <div class="form-group">
        <label>Number 1</label>
        <input type="number" id="add-num1" value="10" />
      </div>
      <div class="form-group">
        <label>Number 2</label>
        <input type="number" id="add-num2" value="20" />
      </div>
      <button onclick="callAdd()">Calculate</button>
      <div class="result" id="add-result"></div>
    </div>

    <!-- GenerateSequence -->
    <div class="card">
      <h2>📊 GenerateSequence <span class="badge stream">SERVER STREAM</span></h2>
      <p>Generate a sequence of numbers</p>
      <div class="form-group">
        <label>Start</label>
        <input type="number" id="seq-start" value="1" />
      </div>
      <div class="form-group">
        <label>End</label>
        <input type="number" id="seq-end" value="10" />
      </div>
      <div class="form-group">
        <label>Step</label>
        <input type="number" id="seq-step" value="2" />
      </div>
      <button onclick="callSequence()">Generate</button>
      <div class="result" id="seq-result"></div>
    </div>

    <!-- CreateTodo -->
    <div class="card">
      <h2>📝 CreateTodo <span class="badge">UNARY</span></h2>
      <p>Create a new todo item</p>
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="todo-title" value="Learn gRPC" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" id="todo-desc" value="Study all RPC patterns" />
      </div>
      <div class="form-group">
        <label>Priority</label>
        <select id="todo-priority">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH" selected>High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
      <button onclick="callCreateTodo()">Create Todo</button>
      <div class="result" id="todo-result"></div>
    </div>

    <!-- ListTodos -->
    <div class="card">
      <h2>📋 ListTodos <span class="badge stream">SERVER STREAM</span></h2>
      <p>List all todos (streamed from server)</p>
      <button onclick="callListTodos()">List All Todos</button>
      <div class="result" id="list-result"></div>
    </div>
  </div>

  <div class="endpoints">
    <h3>Available REST Endpoints</h3>
    <code>GET /api/hello?name=World&language=en</code>
    <code>GET /api/user/:id</code>
    <code>GET /api/add?num1=10&num2=20</code>
    <code>GET /api/sequence?start=1&end=10&step=2</code>
    <code>POST /api/todo</code>
    <code>GET /api/todos</code>
  </div>

  <script>
    async function apiCall(url, options = {}) {
      try {
        const res = await fetch(url, options);
        const data = await res.json();
        return { success: res.ok, data };
      } catch (e) {
        return { success: false, data: { error: e.message } };
      }
    }

    function showResult(id, data, success) {
      const el = document.getElementById(id);
      el.textContent = JSON.stringify(data, null, 2);
      el.className = 'result show ' + (success ? 'success' : 'error');
    }

    async function callSayHello() {
      const name = document.getElementById('hello-name').value;
      const language = document.getElementById('hello-lang').value;
      const { success, data } = await apiCall(\`/api/hello?name=\${name}&language=\${language}\`);
      showResult('hello-result', data, success);
    }

    async function callGetUser() {
      const id = document.getElementById('user-id').value;
      const { success, data } = await apiCall(\`/api/user/\${id}\`);
      showResult('user-result', data, success);
    }

    async function callAdd() {
      const num1 = document.getElementById('add-num1').value;
      const num2 = document.getElementById('add-num2').value;
      const { success, data } = await apiCall(\`/api/add?num1=\${num1}&num2=\${num2}\`);
      showResult('add-result', data, success);
    }

    async function callSequence() {
      const start = document.getElementById('seq-start').value;
      const end = document.getElementById('seq-end').value;
      const step = document.getElementById('seq-step').value;
      const { success, data } = await apiCall(\`/api/sequence?start=\${start}&end=\${end}&step=\${step}\`);
      showResult('seq-result', data, success);
    }

    async function callCreateTodo() {
      const title = document.getElementById('todo-title').value;
      const description = document.getElementById('todo-desc').value;
      const priority = document.getElementById('todo-priority').value;
      const { success, data } = await apiCall('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority })
      });
      showResult('todo-result', data, success);
    }

    async function callListTodos() {
      const { success, data } = await apiCall('/api/todos');
      showResult('list-result', data, success);
    }
  </script>
</body>
</html>
`;

// Parse request body
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Parse URL and query params
function parseUrl(url) {
  const [path, queryString] = url.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return { path, params };
}

// Request handler
async function handleRequest(req, res) {
  const { path, params } = parseUrl(req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Serve HTML UI
  if (path === '/' || path === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML_UI);
    return;
  }

  // API Routes
  res.setHeader('Content-Type', 'application/json');

  try {
    // SayHello
    if (path === '/api/hello') {
      const result = await promisify(greetingClient, 'sayHello')({
        name: params.name || 'World',
        language: params.language || 'en'
      });
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }

    // GetUser
    if (path.startsWith('/api/user/')) {
      const userId = parseInt(path.split('/').pop());
      try {
        const result = await promisify(greetingClient, 'getUser')({ user_id: userId });
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: error.message }));
      }
      return;
    }

    // Add
    if (path === '/api/add') {
      const result = await promisify(calculatorClient, 'add')({
        num1: parseFloat(params.num1) || 0,
        num2: parseFloat(params.num2) || 0
      });
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }

    // GenerateSequence (Server Streaming → collected as array)
    if (path === '/api/sequence') {
      const call = calculatorClient.generateSequence({
        start: parseInt(params.start) || 1,
        end: parseInt(params.end) || 10,
        step: parseInt(params.step) || 1
      });
      const results = await collectStream(call);
      res.writeHead(200);
      res.end(JSON.stringify({ sequence: results }));
      return;
    }

    // CreateTodo
    if (path === '/api/todo' && req.method === 'POST') {
      const body = await parseBody(req);
      const result = await promisify(todoClient, 'createTodo')({
        title: body.title || 'Untitled',
        description: body.description || '',
        priority: body.priority || 'LOW'
      });
      res.writeHead(201);
      res.end(JSON.stringify(result));
      return;
    }

    // ListTodos (Server Streaming → collected as array)
    if (path === '/api/todos') {
      const call = todoClient.listTodos({});
      const results = await collectStream(call);
      res.writeHead(200);
      res.end(JSON.stringify({ todos: results.map(r => r.todo) }));
      return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Start server
const PORT = 3000;
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║      🌐 REST Gateway for gRPC Server              ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log(`║  🔗 Browser UI:  http://localhost:${PORT}             ║`);
  console.log('║  📡 gRPC Server: localhost:50051                  ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log('║  REST Endpoints:                                  ║');
  console.log('║  GET  /api/hello?name=X&language=en               ║');
  console.log('║  GET  /api/user/:id                               ║');
  console.log('║  GET  /api/add?num1=X&num2=Y                      ║');
  console.log('║  GET  /api/sequence?start=1&end=10&step=2         ║');
  console.log('║  POST /api/todo                                   ║');
  console.log('║  GET  /api/todos                                  ║');
  console.log('╚═══════════════════════════════════════════════════╝');
});

