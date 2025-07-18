import amqp from 'amqplib';

export async function sendCommandToQueue(queueName, message) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(queueName);
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
}
