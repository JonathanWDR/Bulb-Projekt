import express from 'express';
import bodyParser from 'body-parser';
import { produceLampCommands } from './producer.js';

const app = express();
app.use(bodyParser.json());

app.post('/on', async (req, res) => {
  await produceLampCommands('on');
  res.send({ status: 'ok', command: 'on' });
});

app.post('/off', async (req, res) => {
  await produceLampCommands('off');
  res.send({ status: 'ok', command: 'off' });
});

app.post('/brightness', async (req, res) => {
  const { value } = req.body;
  await produceLampCommands('brightness', value);
  res.send({ status: 'ok', command: 'brightness', value });
});

app.post('/color', async (req, res) => {
  const { value } = req.body;
  await produceLampCommands('color', value);
  res.send({ status: 'ok', command: 'color', value });
});

app.post('/morse', async (req, res) => {
  const { value } = req.body;
  await produceLampCommands('morse', value);
  res.send({ status: 'ok', command: 'morse', value });
});

app.listen(3000, () => {
  console.log('Producer API listening on port 3000');
});