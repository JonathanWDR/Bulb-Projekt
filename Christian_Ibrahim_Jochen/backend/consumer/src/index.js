import { createChannel } from "../../shared/rabbitmq.js";

// Name der Queue
const QUEUE = "lamp-commands";

async function startConsumer() {
  // Channel einrichten (durable Queue + prefetch(1))
  const ch = createChannel();

  await ch.waitForConnect();
  console.log("🕒 Consumer waiting for messages…");

  // Hier kommen die Nachrichten rein
  await ch.consume(QUEUE, async (msg) => {
    if (!msg) return;

    // 1) Raw-Log
    console.log("📥 [consumer] Message arrived:", msg.content.toString());

    let cmd;
    try {
      cmd = JSON.parse(msg.content.toString());
    } catch (err) {
      console.error("⚠️ Invalid JSON:", err);
      return ch.ack(msg);
    }

    try {
      // 2) Verarbeite den Befehl (Stub oder echte TP-Link-Aufrufe)
      console.log("✅ [consumer] Executing", cmd);
      // z.B. await device.turnOn() etc.

      // 3) Nur wenn alles geklappt hat:
      ch.ack(msg);
    } catch (err) {
      console.error("❌ [consumer] Fehler, requeue:", err);
      ch.nack(msg, false, true); // Nachricht bleibt in der Queue
    }
  });
}

startConsumer().catch((err) => console.error(err));
