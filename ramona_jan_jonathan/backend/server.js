const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

const producer = require('./producer');
console.log('🔑 Producer geladen:\n');

require('./consumer');
console.log('🔑 Consumer geladen:\n');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/led', async (req, res) => {
  const state = req.body;
  console.log('📩 Received state (server):', state);
  await producer.sendToQueue(state);
  res.send({ status: 'Message sent to queue', state });
});

app.post('/getState', async (req, res) => {
  console.log('📩 Received getState request');
  await producer.sendToQueue(req.body);
  res.send({
    status: 'Request sent to queue for current state',
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

