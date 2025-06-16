// backend/producer/send.js
import { createChannel } from "../../shared/rabbitmq.js";

async function sendLampCommand(command) {
  const channel = await createChannel();
  await channel.sendToQueue("lamp-commands", Buffer.from(JSON.stringify(command)));
  console.log("📤 Befehl gesendet:", command);
}

// Beispielbefehl:
sendLampCommand({ command: "color", value: "red" });
