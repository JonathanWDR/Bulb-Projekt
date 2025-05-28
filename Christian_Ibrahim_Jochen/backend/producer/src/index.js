import { sendCommand } from "../../shared/rabbitmq.js";

async function main() {
  const args = process.argv.slice(2); // e.g. node index.js on
  const [cmd, val] = args;
  await sendCommand({ command: cmd, value: val });
  console.log("Sent:", cmd, val);
}
main();
