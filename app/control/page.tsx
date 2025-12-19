'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';

function Controller() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // 1. Use the environment variable here too!
    const SOCKET_SERVER = process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://192.168.1.60:8080";

    const newSocket = io(SOCKET_SERVER);

    newSocket.on('connect', () => {
      console.log("Connected to server");
      // 2. Join the session as soon as we connect
      if (sessionId) {
        newSocket.emit('joinSession', sessionId);
      }
    });

    setSocket(newSocket);
    return () => {
      newSocket.off('connect');
      newSocket.disconnect();
    };
  }, [sessionId]); // Re-run if sessionId changes

  const startSensors = async () => {
    // iOS Permission Check
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res !== 'granted') return alert('Permission denied');
      } catch (err) {
        console.error("DeviceOrientation permission error:", err);
      }
    }

    window.addEventListener('deviceorientation', (e) => {
      // e.gamma is the left-to-right tilt
      if (socket && sessionId && e.gamma !== null) {
        socket.emit('tiltCommand', { sessionId, angle: e.gamma });
      }
    });
  };

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'sans-serif' }}>
      <h2>Dog Controller</h2>
      <p>Session: {sessionId}</p>
      <button
        onClick={startSensors}
        style={{
          padding: '20px',
          fontSize: '20px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        Start Dog Controller
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Controller...</div>}>
      <Controller />
    </Suspense>
  );
}