const amqp = require('amqplib');
// const { Client } = require('tplink-bulb');

async function startConsumer() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  const exchange = 'lamp_control';
  await channel.assertExchange(exchange, 'direct', { durable: true });

  const q = await channel.assertQueue('', { exclusive: true });

  // Required actions for bulb
  ['on','off','brightness','color','morse'].forEach(key => channel.bindQueue(q.queue, exchange, key));

  console.log('Consumer wartet auf Events...');
  channel.consume(q.queue, msg => {
    if (!msg) return;
    // msg received
    const action = msg.fields.routingKey;
    const payload = JSON.parse(msg.content.toString());

    console.log(`Received: ${action} ->`, payload);

    //TODO: Lampe ansteuern
    switch(action) {
      case "on":
        console.log('Lampe einschalten...')
        break
      // ... ToDo
    }

    channel.ack(msg);
  });
}

startConsumer().catch(console.error);