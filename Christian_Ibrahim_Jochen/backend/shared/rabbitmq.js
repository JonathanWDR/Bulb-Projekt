import { connect, ChannelWrapper } from "amqp-connection-manager";

const QUEUE = "lamp-commands";

export function createChannel() {
  const conn = connect([process.env.RABBIT_URL]);
  const ch = conn.createChannel({
    json: true,
    setup: (c) => c.assertQueue(QUEUE, { durable: true }).then(() => c.prefetch(1)),
  });
  return ch;
}

export async function sendCommand(cmd) {
  const ch = createChannel();
  await ch.waitForConnect();
  await ch.sendToQueue(QUEUE, cmd, { persistent: true });
}

export function consumeCommands(onMessage) {
  const ch = createChannel();
  ch.waitForConnect().then(() => ch.consume(QUEUE, onMessage));
}
