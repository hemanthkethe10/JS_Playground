function createEventHub() {
    const eventMap = {};
  
    return {
      on(event, handler) {
        if (!eventMap[event]) {
          eventMap[event] = [];
        }
        eventMap[event].push(handler);
      },
      emit(event, data) {
        if (eventMap[event]) {
          eventMap[event].forEach(handler => handler(data));
        }
      }
    };
  }
  
  // Example usage:
  const hub = createEventHub();
  
  hub.on("message", function(data) {
    console.log(`${data.username} said ${data.text}`);
  });
  
  hub.emit("message", {
    username: "John",
    text: "Hello?"
  });
  hub.emit("message", {
    username: "John 111111",
    text: "Hello?"
  });
  