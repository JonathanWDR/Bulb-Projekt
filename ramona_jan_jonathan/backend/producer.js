const amqp = require('amqplib');

const QUEUE = 'led_control';

async function sendToQueue(message) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE);
  ch.sendToQueue(QUEUE, Buffer.from(message));
  setTimeout(() => conn.close(), 500);
}

module.exports = { sendToQueue };
