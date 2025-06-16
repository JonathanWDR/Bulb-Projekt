import { createChannel } from "../../shared/rabbitmq.js";
import { createDevice } from "../../shared/device.js";
import { playMorse } from "../../shared/morse.js";
import { ValidationError } from "./errors.js";

async function startConsumer() {
  const channel = createChannel();
  await channel.waitForConnect();
  console.log("🕒 Consumer wartet…");

  const device = await createDevice();
  console.log("🔧 Gerät erstellt");

  await channel.consume("lamp-commands", async (msg) => {
    if (!msg) return;
    try {
      const cmd = JSON.parse(msg.content.toString());

      switch (cmd.command) {
        case "on":
          await device.turnOn();
          break;

        case "off":
          await device.turnOff();
          break;

        case "brightness": {
          const b = parseInt(cmd.value, 10);
          if (isNaN(b) || b < 1 || b > 100) {
            throw new ValidationError(`Ungültiger Helligkeitswert: ${cmd.value} (1–100)`);
          }
          await device.setBrightness(b);
          break;
        }

        case "color": {
          await device.setColour(cmd.value);
          break;
        }
        case "morse": {
          if (typeof cmd.value !== "string") {
            throw new Error("Morse command needs 'value' with text!");
          }
          await playMorse(device, cmd.value);
          break;
        }

        default:
          throw new ValidationError(`Unbekannter Befehl: ${cmd.command}`);
      }

      channel.ack(msg);
    } catch (err) {
      if (err instanceof ValidationError) {
        console.warn("Validation failed, dropping message:", err.message);
        channel.ack(msg);
      } else {
        console.error("Runtime error, requeueing:", err);
        channel.nack(msg, false, true);
      }
    }
  });
}

startConsumer().catch((err) => {
  console.error("Fataler Fehler:", err);
  process.exit(1);
});
