
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRouter } from './api/routes.js';

const queueName = 'lamp-control';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'public');

app.use('/api', createRouter(queueName));
app.use(express.static(publicPath));

app.listen(4000, async () => {
  console.log('Serving static files from:', publicPath);
  console.log('🚀 Server läuft auf http://localhost:4000');
});
