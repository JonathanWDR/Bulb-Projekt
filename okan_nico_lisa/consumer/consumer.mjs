import * as TPLink from 'tplink-bulbs';
import * as dotenv from 'dotenv'
import { flashMorse } from './morse.js';
import { getRabbitMQChannel } from './rabbitmq/rmq.js';

async function startConsumer() {
  dotenv.config();

  const exchange = "lamp_control"
  const channel = await getRabbitMQChannel(exchange)
  const q = await channel.assertQueue('', { exclusive: true });

  // Required actions for bulb
  ['on','off','brightness','color','morse'].forEach(key => channel.bindQueue(q.queue, exchange, key));

  // TP Link Controls
  const email = process.env.TP_Email;
  const password = process.env.TP_Passwd;
  const deviceId = process.env.TP_Device_Id;
  const deviceIpAddress = process.env.TP_Device_Ip;

  const cloudApi = await TPLink.API.cloudLogin(email, password);
  const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
  console.log('Devices: ', devices);
  const targetDevice = devices.find(device => device.deviceId === deviceId);

  if (!targetDevice) {
    console.error(`Device with ID "${deviceId}" not found.`);
    return;
  }

  console.log('Logging in to TPLink device...')
  const device = await TPLink.API.loginDeviceByIp(email, password, deviceIpAddress)
  console.log('Logged in on bulb named', device.nickname)

  const info = await device.getDeviceInfo();
  console.log('Device info:', info);

  // Consume events...
  console.log('Consumer waiting for events...');
  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    // Message received through channel
    const action = msg.fields.routingKey;
    const payload = JSON.parse(msg.content.toString());

    console.log(`In: ${action} ->`, payload);

    try {
      switch(action) {
        case "on":
          console.log('Turning on bulb...')
          await device.turnOn();
          break
        case "off":
          console.log('Turning off bulb...')
          await device.turnOff();
          break
        case "brightness":
          const brightnessString = payload['value'];
          const brightness = parseInt(brightnessString)
          if (typeof brightness === 'number' && brightness > 0 && brightness <= 100) {
            console.log(`Setting brightness: ${brightness}%...`);
            await device.setBrightness(brightness);
          } else {
            console.log('Invalid brightness:', brightness);
          }
          break;
        case "color":
          const color = payload['value']
          console.log(`Changing color to ${color}...`)
          await device.setColour(color)
          break;
        case "morse":
          const morse = payload['value']
          if (typeof morse === 'string' && morse.length > 0) {
            console.log(`Morsing text "${morse}"...`);
            await flashMorse(device, morse);
          } else {
            console.log('Invalid morse code:', payload);
          }
          break;
        default:
          console.log('Received unknown action type:', action);
      }
    } catch (err) {
      console.log('Error on handling event: ' + err)
    }

    channel.ack(msg);
  });
}

startConsumer().catch(console.error);