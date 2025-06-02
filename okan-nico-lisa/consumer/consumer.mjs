import * as TPLink from 'tplink-bulbs';
import * as amqp from 'amqplib'
import * as dotenv from 'dotenv'

async function startConsumer() {
  dotenv.config();

  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  const exchange = 'lamp_control';
  await channel.assertExchange(exchange, 'direct', { durable: true });

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
  console.log(devices);
  const targetDevice = devices.find(device => device.deviceId === deviceId);

  if (!targetDevice) {
    console.error(`Device with ID "${deviceId}" not found.`);
    return;
  }

  console.log('Logging in...')
  const device = await TPLink.API.loginDeviceByIp(email, password, deviceIpAddress)
  console.log('Logged in!')

  const info = await device.getDeviceInfo();
  console.log('Device info:', info);

  // Consume events...
  console.log('Consumer waiting for events...');
  channel.consume(q.queue, msg => {
    if (!msg) return;
    // Message received
    const action = msg.fields.routingKey;
    const payload = JSON.parse(msg.content.toString());

    console.log(`In: ${action} ->, payload`);

    //TODO: Bulb controls
    switch(action) {
      case "on":
        console.log('Turning on bulb...')
        device.turnOn();
        break
      case "off":
        console.log('Turning off bulb...')
        device.turnOff();
        break
      // ... ToDo
    }

    channel.ack(msg);
  });
}

startConsumer().catch(console.error);