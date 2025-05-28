import { connect } from "amqp-connection-manager";

const QUEUE = "lamp-commands";

export function createChannel() {
  const conn = connect([process.env.RABBIT_URL]);
  conn.on("connect", () => console.log("✅ RabbitMQ connected at", process.env.RABBIT_URL));
  conn.on("disconnect", ({ err }) => console.error("❌ RabbitMQ disconnected", err));
  const ch = conn.createChannel({
    json: true,
    setup: (ch) => ch.assertQueue(QUEUE, { durable: true }).then(() => ch.prefetch(1)),
  });
  return ch;
}

export async function sendCommand(cmd) {
  const ch = createChannel();
  await ch.waitForConnect();
  console.log("⏳ [producer] Connected to RabbitMQ at", process.env.RABBIT_URL);
  console.log("⏳ [producer] Sending command →", cmd);
  await ch.sendToQueue("lamp-commands", cmd, { persistent: true });
  console.log("📤 [producer] Sent command to queue ✔");
}
