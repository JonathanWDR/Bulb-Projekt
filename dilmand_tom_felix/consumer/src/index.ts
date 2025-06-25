import {RabbitMQConsumerService} from './services/RabbitMQConsumerService';
import {closeRabbitMQConnection} from './config/rabbitmq';
import { createTplinkDeviceConnection } from './config/tplink';
import { MockLampDevice } from './config/mockLamp';

async function main() {
    let device: any;
    let isMock = false;
    
    try {
        console.log("Versuche Verbindung zur echten Lampe herzustellen...");
        device = await createTplinkDeviceConnection();
        console.log("Erfolgreich mit echter Lampe verbunden!");
    } catch (err) {
        console.warn("Echte Lampe nicht erreichbar, verwende MockDevice für initialen Start", err);
        device = new MockLampDevice();
        isMock = true;
    }

    const consumer = new RabbitMQConsumerService(device, isMock);
    await consumer.start();
    console.log("Consumer wurde gestartet und ist bereit, Befehle zu empfangen.");

    startReconnectAttempts(consumer);

    process.on('SIGINT', async () => {
        console.log("Shutting down...");
        await consumer.stop();
        await closeRabbitMQConnection();
        process.exit(0);
    });
}

function startReconnectAttempts(consumer: RabbitMQConsumerService) {
    setInterval(async () => {
        try {
            const device = await createTplinkDeviceConnection();
            consumer.setDevice(device);
            consumer.setIsMock(false);

            console.log("Verbindung zur echten Lampe ist möglich.");
        } catch (err) {
            console.log("Echte Lampe weiterhin nicht erreichbar.");
            consumer.setDevice(new MockLampDevice());
            consumer.setIsMock(true);
        }
    }, 30000);
}

main();