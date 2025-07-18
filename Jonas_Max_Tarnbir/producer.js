import amqp from 'amqplib';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.static('.'));

const queueName = 'lamp-command';

let channel = null;

async function setUp(){
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
}
setUp();

app.post('/power', async (req, res) =>{
    if(!channel) return res.status(503).send('RabbitMQ not ready');
    const { value } = req.body;
    if(!['on','off'].includes(value)) return res.status(400).send('Invalid Value');
    const command = { command: value }
    const msgBuffer = Buffer.from(JSON.stringify(command));
    channel.sendToQueue(queueName, msgBuffer)
    res.send(`Power command "${value}" sent`);
  }
);

app.post('/color', async (req, res) =>{
    if(!channel) return res.status(503).send('RabbitMQ not ready');
    const { value } = req.body;
    if(!value) return res.status(400).send('Value required');
    const command = { command: 'color', value: value }
    const msgBuffer = Buffer.from(JSON.stringify(command));
    channel.sendToQueue(queueName, msgBuffer)
    res.send(`Color command "${value}" sent`);
  }
);

app.post('/morse', async (req, res) =>{
  if(!channel) return res.status(503).send('RabbitMQ not ready');
  const { value } = req.body;
  if(value.match(/^[a-zA-Z0-9_@$&() ]+$/) === null) return res.status(400).send('Unallowed Character Input. Allowed Characters: a-z, A-Z, 0-9 and _@#$%^&*()');
  const command = { command: 'morse', value: value }
  const msgBuffer = Buffer.from(JSON.stringify(command));
  channel.sendToQueue(queueName, msgBuffer)
  res.send(`Morse command "${value}" sent`);
});

app.post('/brightness', async (req, res) =>{
    if(!channel) return res.status(503).send('RabbitMQ not ready');
    const { value } = req.body;
    if(typeof value !== 'number' || value < 0 || value > 100) return res.status(400).send('Value must either be or be between 0 and 100');
    const command = { command: 'brightness', value: value }
    const msgBuffer = Buffer.from(JSON.stringify(command));
    channel.sendToQueue(queueName, msgBuffer)
    res.send(`Brightness command "${value}" sent`);
  }
);

app.listen(3000, () => {
  console.log('Producer listening at http://localhost:3000')
});



