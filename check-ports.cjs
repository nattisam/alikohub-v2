const net = require('net');

const ports = [3000, 3001, 3009, 3002, 3003, 3004, 3005];
const serviceNames = {
  3000: 'api-gateway',
  3001: 'auth-service',
  3009: 'file-upload-service',
  3002: 'academy-backend',
  3003: 'con-tech-backend',
  3004: 'careers-service',
  3005: 'events-backend'
};

ports.forEach(port => {
  const socket = new net.Socket();
  socket.setTimeout(2000);
  
  socket.on('connect', () => {
    console.log(`Port ${port} (${serviceNames[port]}): OPEN`);
    socket.destroy();
  });
  
  socket.on('timeout', () => {
    console.log(`Port ${port} (${serviceNames[port]}): TIMEOUT`);
    socket.destroy();
  });
  
  socket.on('error', (err) => {
    console.log(`Port ${port} (${serviceNames[port]}): CLOSED (Error: ${err.message})`);
  });
  
  socket.connect(port, 'localhost');
});
