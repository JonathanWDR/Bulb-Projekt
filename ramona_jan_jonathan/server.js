require('dotenv').config();

// 1) Zeige, ob dotenv Deine .env lädt:
console.log('🔑 ENV geladen:', {
  TP_EMAIL: !!process.env.TP_EMAIL,
  TP_PASSWORD: !!process.env.TP_PASSWORD
});

// 2) Starte Express
const express = require('express');
const app = express();
console.log('🚀 server.js wird ausgeführt');

// 3) Eine einfache Route, die immer antwortet:
app.get('/', (_req, res) => {
  res.send('👋 Hello World! Server läuft.');
});

// 4) Auf Port 3000 hören und bestätigen:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Express-Listener: http://localhost:${PORT}`);
});
