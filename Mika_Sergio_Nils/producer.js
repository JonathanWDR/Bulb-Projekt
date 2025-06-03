import amqp from 'amqplib';

export async function produceLampCommands(commandType, value) {
  const queueName = 'lamp-commands';

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    const command = { command: commandType, value: value };
    console.log()
    const msgBuffer = Buffer.from(JSON.stringify(command));
    channel.sendToQueue(queueName, msgBuffer);
    console.log('[x] Sent:', command, 'JSON: ', JSON.stringify(command));

    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);

  } catch (error) {
    console.error('Error in producer:', error);
  }
}
// Example usage:
// produceLampCommands('morse', 'SOS');