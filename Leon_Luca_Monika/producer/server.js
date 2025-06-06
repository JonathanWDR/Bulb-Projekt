import express from 'express';
import cors from 'cors';
import {
    setLampState,
    setLampBrightness,
    setLampColor,
    showMorseCode
} from './producer.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Lampe an/aus
app.post('/lamp/state', async (req, res) => {
    const { state } = req.body;
    if (typeof state !== 'boolean') {
        return res.status(400).json({ error: 'state must be boolean' });
    }
    try {
        await setLampState(state);
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

// Helligkeit setzen
app.post('/lamp/brightness', async (req, res) => {
    const { brightness } = req.body;
    if (typeof brightness !== 'number' || brightness < 0 || brightness > 100) {
        return res.status(400).json({ error: 'brightness must be number 0-100' });
    }
    try {
        await setLampBrightness(brightness);
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

// Farbe setzen
app.post('/lamp/color', async (req, res) => {
    const { color } = req.body;
    if (typeof color !== 'string' || !color.trim()) {
        return res.status(400).json({ error: 'color must be a string' });
    }
    try {
        await setLampColor(color);
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

// Morsecode anzeigen
app.post('/lamp/morse', async (req, res) => {
    const { morse } = req.body;
    if (typeof morse !== 'string') {
        return res.status(400).json({ error: 'morse must be a string' });
    }
    try {
        await showMorseCode(morse);
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(500).json({ error: e.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Lamp producer backend listening at http://localhost:${PORT}`);
});