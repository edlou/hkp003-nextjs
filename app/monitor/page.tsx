'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
import 'animate.css';

export default function MonitorPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tilt, setTilt] = useState(0);
  // const sessionId = "v3izpuw"; // Match this with your phone's sessionId
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a random ID for the session
    const randomId = Math.random().toString(36).substring(2, 8);
    setSessionId(randomId);

    setHasMounted(true);
    // Use your IP for now, friend will change this to AWS URL later
    // const socket = io("http://192.168.1.60:8080");
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://192.168.1.60:8080");

    socket.on('connect', () => {
      socket.emit('joinSession', randomId);
      // socket.emit('joinSession', sessionId);
    });

    socket.on('updateDisplay', (data) => {
      setTilt(data.angle); // Receive tilt from phone
    });

    return () => { socket.disconnect(); };
  }, []);

  if (!hasMounted) return null;

  const qrUrl = `${window.location.origin}/control?sessionId=${sessionId}`;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen  p-6 overflow-hidden animate__animated animate__fadeIn">
      <h1 className="text-5xl font-black text-red-700 mb-2 tracking-widest animate__animated animate__backInDown">
        求籤
      </h1>


      <div className="relative flex items-center justify-center w-64 h-64 my-10 transition-transform duration-75 ease-linear"
        style={{ transform: `rotate(${tilt}deg)` }}>
        <Image src="/draw.jpeg" alt="draw Image" width={150} height={150} />
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-4 mt-auto md:mt-10">
        <div className="bg-white p-4 rounded-3xl shadow-xl border-t-4 border-orange-200">
          <QRCodeSVG value={qrUrl} size={140} />
        </div>

        <div className="text-center">
          <p className="text-gray-500 font-semibold text-sm uppercase tracking-tighter">
            Scan to Connect
          </p>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Session: <span className="text-red-500">{sessionId}</span>
          </p>
        </div>
      </div>
      <p>Scan with phone then shake</p>
    </main>
  );
}