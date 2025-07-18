import amqp from "amqplib";
import { blinkMorse } from "../lamp/controller.js";
import { setupLamp } from "../lamp/setup.js";
import dotenv from "dotenv";

dotenv.config();

let brightnessTimeout;
const queueName = "lamp-control";

const email = process.env.TP_EMAIL;
const password = process.env.TP_PASSWORD;
const deviceId = process.env.TP_DEVICE_ID;
const result = await setupLamp(email, password, deviceId);
const device = result.device;

export async function startConsumer(queueName, device) {
  try {
    const conn = await amqp.connect("amqp://127.0.0.1");
    const ch = await conn.createChannel();
    await ch.assertQueue(queueName);

    ch.consume(queueName, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log("Empfangener Befehl:", data);

      try {
        if (data.type === "basic") {
          if (data.command === "on") {
            await device.turnOn();
            console.log("Lampe eingeschaltet");
          } else if (data.command === "off") await device.turnOff();
          else if (["red", "green", "blue"].includes(data.command)) {
            await device.setColor(data.command);
            console.log("Farbe gesetzt:", data.command);
          }
        } else if (data.type === "brightness") {
          clearTimeout(brightnessTimeout);
          brightnessTimeout = setTimeout(async () => {
            await device.setBrightness(parseInt(data.value));
            console.log("Helligkeit gesetzt:", data.value);
          }, 300);
        } else if (data.type === "morse") {
          await blinkMorse(device, data.text);
          console.log("Morse-Nachricht geblinkt:", data.text);
        } else if (data.type === "color") {
          await device.setColor(data.value);
          console.log("Farbe gesetzt:", data.value);
        }
      } catch (err) {
        console.error(
          "Fehler bei der Verarbeitung der Nachricht:",
          err.message
        );
      }

      ch.ack(msg);
    });
  } catch (err) {
    console.error("Fehler beim Starten des RabbitMQ Consumers:", err.message);
  }
}

try {
  await startConsumer(queueName, device);
} catch (err) {
  console.error("Fehler beim Starten des Consumers:", err.message);
  process.exit(1);
}
