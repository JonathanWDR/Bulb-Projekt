import express from 'express';
import { sendCommandToQueue } from '../messaging/producer.js';

export function createRouter(queueName) {
  const router = express.Router();

  router.post('/command', async (req, res) => {
    try {
      await sendCommandToQueue(queueName, req.body);
      console.log('Befehl gesendet:', req.body);
      res.sendStatus(200);
    } catch (err) {
      console.error('Fehler beim POST /api/command:', err.message);
      res.sendStatus(500);
    }
  });

  return router;
}
