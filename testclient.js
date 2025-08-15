// client.js
const { io } = require("socket.io-client");

// Connect to your NestJS gateway (adjust URL and port if needed)
const socket = io("http://localhost:3000", {
  transports: ["websocket"], // force WebSocket for cleaner logs
});

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server");

  // Send a message event to the server
  socket.emit("message", { text: "Hello from client.js" }, (response) => {
    console.log("📩 Server responded:", response);
  });
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from server");
});
