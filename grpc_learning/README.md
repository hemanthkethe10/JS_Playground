# gRPC Learning Project 🚀

A comprehensive Node.js gRPC learning project demonstrating all four types of RPC patterns.

## 📚 What is gRPC?

gRPC (gRPC Remote Procedure Calls) is a high-performance, open-source RPC framework developed by Google. It uses:

- **Protocol Buffers (protobuf)** - A language-neutral, platform-neutral serialization format
- **HTTP/2** - For transport, enabling features like multiplexing, flow control, and header compression
- **Strongly typed contracts** - Services and messages are defined in `.proto` files

## 🔄 Four Types of RPC

### 1. Unary RPC
Simple request-response pattern (like REST).
```
Client ─────Request────▶ Server
Client ◀────Response──── Server
```

### 2. Server Streaming RPC
Client sends one request, server sends multiple responses.
```
Client ─────Request────▶ Server
Client ◀────Response 1── Server
Client ◀────Response 2── Server
Client ◀────Response N── Server
```

### 3. Client Streaming RPC
Client sends multiple requests, server sends one response.
```
Client ─────Request 1───▶ Server
Client ─────Request 2───▶ Server
Client ─────Request N───▶ Server
Client ◀────Response───── Server
```

### 4. Bidirectional Streaming RPC
Both client and server send streams of messages.
```
Client ◀────▶ Server (messages flow both ways)
```

## 📁 Project Structure

```
grpc_learning/
├── proto/
│   └── learning.proto      # Service definitions
├── server.js               # gRPC server implementation
├── client.js               # gRPC client implementation
├── package.json            # Dependencies
└── README.md               # This file
```

## 🛠️ Setup & Installation

```bash
cd grpc_learning
npm install
```

## 🚀 Running the Project

### Start the Server
```bash
node server.js
```

### Run the Client (in another terminal)
```bash
node client.js
```

## 📝 Proto File Syntax Explained

```protobuf
syntax = "proto3";           // Protocol buffers version 3

package learning;            // Package namespace

service GreetingService {    // Service definition
  rpc SayHello (HelloRequest) returns (HelloResponse);  // Unary RPC
  rpc ServerStream (StreamRequest) returns (stream StreamResponse);  // Server streaming
  rpc ClientStream (stream NumberRequest) returns (SumResponse);     // Client streaming
  rpc Chat (stream ChatMessage) returns (stream ChatMessage);        // Bidirectional
}

message HelloRequest {       // Message type definition
  string name = 1;          // Field with tag number
  int32 age = 2;            // Each field needs unique tag
}
```

## 🔢 Protocol Buffer Field Types

| Proto Type | JavaScript Type | Description |
|------------|-----------------|-------------|
| `string`   | string          | UTF-8 string |
| `int32`    | number          | 32-bit integer |
| `int64`    | number/bigint   | 64-bit integer |
| `float`    | number          | 32-bit floating point |
| `double`   | number          | 64-bit floating point |
| `bool`     | boolean         | True/false |
| `bytes`    | Buffer          | Binary data |
| `repeated` | Array           | List of values |

## 🎯 Key Concepts

### Why gRPC over REST?

| Feature | gRPC | REST |
|---------|------|------|
| Protocol | HTTP/2 | HTTP/1.1 |
| Payload | Binary (protobuf) | Text (JSON) |
| API Contract | Strict (.proto) | Loose (OpenAPI) |
| Streaming | Native support | Workarounds needed |
| Code Generation | Built-in | External tools |
| Browser Support | Limited | Native |

### When to Use gRPC?

✅ Microservices communication
✅ Low-latency, high-throughput systems
✅ Polyglot environments (multiple languages)
✅ Real-time streaming applications
✅ Mobile clients (bandwidth efficiency)

❌ Browser-based clients (use gRPC-web)
❌ Simple CRUD operations
❌ Human-readable debugging needed

## 🔍 Debugging Tips

1. **Check proto file syntax** - Use `protoc` to validate
2. **Port conflicts** - Ensure port 50051 is available
3. **Version mismatches** - Keep `@grpc/grpc-js` and `@grpc/proto-loader` in sync

## 📖 Learning Resources

- [gRPC Official Documentation](https://grpc.io/docs/)
- [Protocol Buffers Guide](https://developers.google.com/protocol-buffers)
- [gRPC Node.js Quickstart](https://grpc.io/docs/languages/node/quickstart/)

---
Happy Learning! 🎉

