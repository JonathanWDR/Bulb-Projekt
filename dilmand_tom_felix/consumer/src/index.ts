import {RabbitMQConsumerService} from './services/RabbitMQConsumerService';
import {closeRabbitMQConnection} from './config/rabbitmq';
import { createTplinkDeviceConnection } from './config/tplink';
import { MockLampDevice } from './config/mockLamp';

async function main() {
    let device;
    
    try {
        // Versuche, eine Verbindung zur echten Lampe herzustellen
        console.log("Versuche Verbindung zur echten Lampe herzustellen...");
        device = await createTplinkDeviceConnection();
        console.log("Erfolgreich mit echter Lampe verbunden!");
    } catch (err) {
        // Wenn keine Verbindung möglich ist, verwende MockDevice als Fallback
        console.warn("Echte Lampe nicht erreichbar, verwende MockDevice für initialen Start", err);
        device = new MockLampDevice();
    }

    // Consumer startet immer - mit echter Lampe oder MockDevice
    const consumer = new RabbitMQConsumerService(device);
    await consumer.start();
    console.log("Consumer wurde gestartet und ist bereit, Befehle zu empfangen.");

    // Im Hintergrund periodisch versuchen, die echte Lampe zu erreichen
    startReconnectAttempts();

    process.on('SIGINT', async () => {
        console.log("Shutting down...");
        await consumer.stop();
        await closeRabbitMQConnection();
        process.exit(0);
    });
}

// Optional: Periodische Reconnect-Versuche im Hintergrund
function startReconnectAttempts() {
    setInterval(async () => {
        try {
            await createTplinkDeviceConnection();
            console.log("Verbindung zur echten Lampe ist möglich.");
        } catch (err) {
            console.log("Echte Lampe weiterhin nicht erreichbar.");
        }
    }, 30000); // Alle 30 Sekunden prüfen
}

main();