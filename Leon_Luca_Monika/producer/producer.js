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
    const commandType = 'setState';
    //Hier nur true oder false übergeben
    const commandValue = state ? 'on' : 'off';
    await sendLampCommand(commandType, commandValue);
}

async function setLampBrightness(brightness) {
    const commandType = 'setBrightness';
    //Hier nur eine Zahl zwischen 0 und 100 übergeben
    const commandValue = Math.max(0, Math.min(100, brightness)); // Ensure value is between 0 and 100
    await sendLampCommand(commandType, commandValue);
}


async function setLampColor(color) {
    const commandType = 'setColor';
    //Hier nur hexadecimal Farbwerte übergeben, z.B. '#FF5733'
    const commandValue = /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : '#FFFFFF'; // Default to white if invalid
    await sendLampCommand(commandType, commandValue);
}

async function showMorseCode(morseCode) {
    const commandType = 'showMorseCode';
    //Hier nur Strings als Klartext übergeben, die in Morsecode umgewandelt werden sollen
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
