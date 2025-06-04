
import {RabbitMQConsumerService} from './services/RabbitMQConsumerService';
import {closeRabbitMQConnection} from './config/rabbitmq';
import {MockLampDevice} from './config/mockLampDevice';


async function main() {
    const mockDevice = new MockLampDevice();
    const consumer = new RabbitMQConsumerService(mockDevice);
    await consumer.start();

    process.on('SIGINT', async () => {
        console.log("Shutting down...");
        await consumer.stop();
        await closeRabbitMQConnection();
        process.exit(0);
    });
}

main();