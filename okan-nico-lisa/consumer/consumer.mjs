import * as TPLink from 'tplink-bulbs';
import * as amqp from 'amqplib'
import * as dotenv from 'dotenv'

async function startConsumer() {
  dotenv.config()
  
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

  const cloudApi = await TPLink.API.cloudLogin(email, password);
    
  const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
  console.log(devices);
  const targetDevice = devices.find(device => device.deviceId === deviceId);

  if (!targetDevice) {
    console.error(`Device with ID "${deviceId}" not found.`);
    return;
  }

  const device = await TPLink.API.loginDevice(email, password, targetDevice);

  const info = await device.getDeviceInfo();
  console.log('Device Info:', info);

  await device.turnOn();
  await device.setColour('violet');
  await TPLink.API.delay(500);

  await device.setColour('red');
  await TPLink.API.delay(500);

  await device.setColour('orange');
  await TPLink.API.delay(500);

  // Consume events...
  console.log('Consumer wartet auf Events...');
  channel.consume(q.queue, msg => {
    if (!msg) return;
    // msg received
    const action = msg.fields.routingKey;
    const payload = JSON.parse(msg.content.toString());

    console.log(`Received: ${action} ->`, payload);

    //TODO: Lampe ansteuern
    switch(action) {
      case "on":
        console.log('Lampe einschalten...')
        device.turnOn();
        break
      case "off":
        console.log('Lampe ausschalten...')
        device.turnOff();
        break
      // ... ToDo
    }

    channel.ack(msg);
  });
}

startConsumer().catch(console.error);