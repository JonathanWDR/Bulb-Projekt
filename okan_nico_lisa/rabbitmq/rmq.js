import * as amqp from 'amqplib'

export async function getRabbitMQChannel(exchange) {
    const conn = await amqp.connect('amqp://rabbitmq');
    const channel = await conn.createChannel();
    await channel.assertExchange(exchange, 'direct', { durable: true });

    return exchange, channel
}