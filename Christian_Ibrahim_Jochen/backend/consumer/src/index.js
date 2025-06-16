// backend/consumer/src/index.js
import { createChannel } from "../../shared/rabbitmq.js";
import { createDevice } from "../../shared/device.js";

async function startConsumer() {
  const channel = createChannel();
  await channel.waitForConnect();
  console.log("🕒 Consumer wartet…");

  const device = await createDevice();  

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
        case "brightness":
          await device.setBrightness(cmd.value);
          break;
        case "color":
          await device.setColour(cmd.value);
          break;
        default:
          throw new Error(`Unknown command: ${cmd.command}`);
      }
      channel.ack(msg);
    } catch (err) {
      console.error("Fehler, requeue:", err);
      channel.nack(msg, false, false); // 🗝️ WICHTIG: false = nicht requeue sonst Endlosschleife!
    }
  });
}

startConsumer().catch((err) => {
  console.error("Fataler Fehler:", err);
  process.exit(1);
});
