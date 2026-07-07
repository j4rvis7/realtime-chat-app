const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS — bypasses ISP blocks on MongoDB SRV queries

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { initSocket } = require('./socket/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Initialize socket event handlers
initSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
