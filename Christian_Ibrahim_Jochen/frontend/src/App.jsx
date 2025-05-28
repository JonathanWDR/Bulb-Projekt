import React, { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('—');

  // Liest die Variable aus dem Build:
  const API_URL = import.meta.env.VITE_API_URL;

  const sendCommand = async (cmd) => {
    try {
      const res = await fetch(`http://localhost:3000/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setStatus(cmd === 'on' ? 'An' : 'Aus');
    } catch (err) {
      console.error('Fehler beim Senden des Kommandos:', err);
      alert('Konnte Befehl nicht senden');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Lampe steuern</h1>
      <p>Status: <strong>{status}</strong></p>
      <button onClick={() => sendCommand('on')} style={{ marginRight: 10 }}>
        💡 Einschalten
      </button>
      <button onClick={() => sendCommand('off')}>
        🔌 Ausschalten
      </button>
    </div>
  );
}
