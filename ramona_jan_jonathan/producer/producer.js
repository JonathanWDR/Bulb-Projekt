import amqp from 'amqplib';

async function produceLampCommands() {
    const queueName = 'lamp-commands';

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: false });

        const command = { command: 'color', value: 'red' };

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

produceLampCommands();