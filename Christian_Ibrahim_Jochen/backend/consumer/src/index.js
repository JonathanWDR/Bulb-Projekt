// import { tp-client } from "../../shared/tp-client.js";
// import { initKasa } from "../shared/kasaClient.js";

async function handleMsg(msg) {
  const ch = msg.fields.channel;
  const device = await initKasa();
  const cmd = JSON.parse(msg.content.toString());

  try {
    switch (cmd.command) {
      case "on":
        await device.turnOn();
        break;
      case "off":
        await device.turnOff();
        break;
      case "brightness":
        await device.setBrightness(Number(cmd.value));
        break;
      case "color":
        await device.setColour(cmd.value);
        break;
      default:
        throw new Error("Unknown command");
    }
    ch.ack(msg);
    console.log("Done:", cmd);
  } catch (e) {
    console.error("Error, requeuing:", e);
    ch.nack(msg, false, true);
  }
}

// consumeCommands(handleMsg);
console.log("🕒 Consumer waiting for messages…");
