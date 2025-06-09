
import {RabbitMQConsumerService} from './services/RabbitMQConsumerService';
import {closeRabbitMQConnection} from './config/rabbitmq';
import { createTplinkDeviceConnection } from './config/tplink';


async function main() {
    const device = await createTplinkDeviceConnection();
    if (!device) {
        console.error("Failed to create TP-Link device connection.");
        process.exit(1);
    }
    const consumer = new RabbitMQConsumerService(device);
    await consumer.start();

    process.on('SIGINT', async () => {
        console.log("Shutting down...");
        await consumer.stop();
        await closeRabbitMQConnection();
        process.exit(0);
    });
}

main();