const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Frontend connected via WebSocket');

  global.wsClients = global.wsClients || [];
  global.wsClients.push(ws);
});

module.exports = wss;
