const express = require('express');
const amqp = require('amqplib');

async function start() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  const exchange = 'lamp_control';
  await channel.assertExchange(exchange, 'direct', { durable: true });

  const app = express();
  app.use(express.json());
  app.use(express.static("static"));

  // Helper function for sending events
  function publish(key, payload) {
    channel.publish(exchange, key, Buffer.from(JSON.stringify(payload)), { persistent: true });
    console.log(`Out: ${key} ->`, payload);
  }

  // Receive requests from frontend (HTTP) and "relay" to bulb (RabbitMQ)
  app.post('/lamp/:action', (req, res) => {
    const { action } = req.params;
    publish(action, req.body);
    res.json({ status: 'ok', action });
  });

  app.listen(3000, () => console.log('Producer listening on :3000'));
}

start().catch(console.error);