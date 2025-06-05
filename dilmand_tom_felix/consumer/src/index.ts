import { RabbitMQConsumerService } from './services/RabbitMQConsumerService';
import { closeRabbitMQConnection } from './config/rabbitmq';
import { MockLampDevice } from './config/mockLampDevice';

import express from 'express';      // REST-API für Statusausgabe
import cors from 'cors';            // Für Cross-Origin-Anfragen vom Frontend

async function main() {
    // Simuliertes Lampengerät erzeugen
    const mockDevice = new MockLampDevice();

    // Consumer initialisieren, der auf Nachrichten von RabbitMQ hört
    const consumer = new RabbitMQConsumerService(mockDevice);
    await consumer.start();

    // Express-Server zur Statusabfrage starten
    const app = express();
    const port = 4000;

    // CORS aktivieren, damit Frontend vom Producer-Container auf diesen Port zugreifen kann
    app.use(cors());

    // Endpunkt zur Abfrage des aktuellen Lampenzustands
    app.get('/lamp/status', async (req, res) => {
        try {
            const state = await mockDevice.getCurrentState();
            res.json(state);
        } catch (err) {
            console.error("Fehler beim Lesen des Lampenzustands:", err);
            res.status(500).json({ error: "Zustand konnte nicht gelesen werden" });
        }
    });

    // REST-API starten
    app.listen(port, () => {
        console.log(`Lamp status API läuft auf Port ${port}`);
    });

    // Bei Strg+C sauber beenden
    process.on('SIGINT', async () => {
        console.log("Shutting down...");
        await consumer.stop();
        await closeRabbitMQConnection();
        process.exit(0);
    });
}

main();
