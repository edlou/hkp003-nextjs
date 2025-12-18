'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function MonitorPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tilt, setTilt] = useState(0);
  const sessionId = "v3izpuw"; // Match this with your phone's sessionId

  useEffect(() => {
    setHasMounted(true);
    // Use your IP for now, friend will change this to AWS URL later
    // const socket = io("http://192.168.1.60:8080");
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://192.168.1.60:8080");

    socket.on('connect', () => {
      socket.emit('joinSession', sessionId);
    });

    socket.on('updateDisplay', (data) => {
      setTilt(data.angle); // Receive tilt from phone
    });

    return () => { socket.disconnect(); };
  }, []);

  if (!hasMounted) return null;

  const qrUrl = `${window.location.origin}/control?sessionId=${sessionId}`;

  return (
    <div style={{ textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1>Dog Monitor</h1>

      {/* The Dog Box */}
      <div style={{
        width: '150px', height: '150px', background: '#f0ad4e', margin: '50px auto',
        transform: `rotate(${tilt}deg)`, transition: 'transform 0.05s linear',
        display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px'
      }}>
        🐶
      </div>

      <div style={{ background: 'white', padding: '10px', display: 'inline-block', margin: '0 auto' }}>
        <QRCodeSVG value={qrUrl} size={150} />
      </div>
      <p>Scan with phone to tilt the dog</p>
    </div>
  );
}