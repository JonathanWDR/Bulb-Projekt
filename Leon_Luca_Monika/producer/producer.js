import amqp from 'amqplib';
import { WebSocketServer } from 'ws';

// Lampenstatus
const lampState = {
  poweredOn: false,
  brightness: 100,
  color: '#ffffff',
};

// Funktion zum Senden von Befehlen an RabbitMQ
async function sendLampCommand(commandType, commandValue) {
  const queueName = 'lamp-commands';

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    const command = { command: commandType, value: commandValue };
    const msgBuffer = Buffer.from(JSON.stringify(command));
    channel.sendToQueue(queueName, msgBuffer);
    console.log('[x] Sent:', command);

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.error('Error in producer:', error);
  }
}

// WebSocket-Server für Echtzeitkommunikation
const wss = new WebSocketServer({ port: 3003 });
console.log('WebSocket server running on ws://localhost:3003');

// Funktion zum Broadcasten des Lampenstatus
function broadcastLampState() {
  const data = JSON.stringify(lampState);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(data);
    }
  });
}

// WebSocket-Verbindung
wss.on('connection', ws => {
  console.log('Client connected');
  ws.send(JSON.stringify(lampState)); // Sende aktuellen Lampenstatus an neuen Client

  ws.on('message', async (message) => {
    try {
      const { commandType, commandValue } = JSON.parse(message);

      switch (commandType) {
        case 'setState':
          lampState.poweredOn = commandValue === 'on';
          broadcastLampState();
          await sendLampCommand(commandType, commandValue);
          break;
        case 'setBrightness':
          const brightness = parseInt(commandValue, 10); // Konvertiere zu int
          if (!isNaN(brightness) && brightness >= 0 && brightness <= 100) {
            lampState.brightness = brightness;
            broadcastLampState();
            await sendLampCommand(commandType, brightness);
          } else {
            console.error('Invalid brightness value:', commandValue);
          }
          break;
        case 'setColor':
          lampState.color = commandValue;
          broadcastLampState();
          await sendLampCommand(commandType, commandValue);
          break;
        case 'showMorseCode':
          await sendLampCommand(commandType, commandValue);
          console.log(`Morse Code "${commandValue}" sent`);
          break;
        default:
          console.log('Unknown command:', commandType);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
