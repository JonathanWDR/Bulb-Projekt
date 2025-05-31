import amqp from 'amqplib';

async function sendLampCommand(commandType, commandValue) {
    const queueName = 'lamp-commands';

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: false });

        const command = { command: commandType, value: commandValue };

        const msgBuffer = Buffer.from(JSON.stringify(command));
        channel.sendToQueue(queueName, msgBuffer);
        console.log('[x] Sent:', command);

        setTimeout(async () => {
            await channel.close();
            await connection.close();
        }, 500);

    } catch (error) {
        console.error('Error in producer:', error);
    }
}

async function setLampState(state) {
    // commandType is either 'on' or 'off'
    const commandType = state ? 'on' : 'off';

    await sendLampCommand(commandType, null);
}

async function setLampBrightness(brightness) {
    const commandType = 'brightness'; 
   
    // Ensure value is between 0 and 100
    const commandValue = Math.max(0, Math.min(100, brightness)); 
    await sendLampCommand(commandType, commandValue);
}


async function setLampColor(color) {
 const commandType = 'color';
    // Uses hexa-values
    const commandValue = /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : 'unknown'; // Default to white if invalid
    await sendLampCommand(commandType, commandValue);
}

async function showMorseCode(morseCode) {
    const commandType = 'showMorseCode';
    if (typeof morseCode !== 'string' || !morseCode.trim()) {
        morseCode = '';
    }
    await sendLampCommand(commandType, morseCode);
}

export {
  setLampState,
  setLampBrightness,
  setLampColor,
  showMorseCode
};

// Test
(async () => {
  await setLampState(true);
  await setLampBrightness(50);
  //await setLampColor('#00FF00');
})();