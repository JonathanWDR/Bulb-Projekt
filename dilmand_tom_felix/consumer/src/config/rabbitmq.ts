// src/config/rabbitmq.config.ts
import amqp from 'amqplib';

export const rabbitMQConfig = {
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASS || 'guest',
    lampCommandQueue: process.env.LAMP_COMMAND_QUEUE || 'lamp-commands',
};

// Using specific type definitions
let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export async function createRabbitMQChannel(): Promise<amqp.Channel> {
    if (channel) {
        return channel;
    }
    try {
        const connUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
        connection = await amqp.connect(connUrl);
        
        if (!connection) {
            throw new Error('Failed to connect to RabbitMQ');
        } 
        console.log('Successfully connected to RabbitMQ');

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error', err);
            connection = null; // Reset connection
            channel = null;
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
            connection = null; // Reset connection
            channel = null;
        });

        channel = await connection.createChannel();
        if (!channel) {
            channel = null;
            if (connection) {
                await connection.close();
                connection = null;
            }
            throw new Error('Failed to create RabbitMQ channel');
        }
        console.log('RabbitMQ channel created');
        await channel.assertQueue(rabbitMQConfig.lampCommandQueue, { durable: false });
        return channel;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ or create channel:', error);
        if (connection) {
            await connection.close();
            connection = null;
        }
        channel = null;
        throw error;
    }
}


export async function closeRabbitMQConnection(): Promise<void> {
    if (channel) {
        await channel.close();
        channel = null;
    }
    if (connection) {
        await connection.close();
        connection = null;
    }
    console.log('RabbitMQ connection and channel closed');
}