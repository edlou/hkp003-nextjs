'use client';

// react
import { useState, useEffect } from 'react';

// nextjs
import Image from 'next/image';

// qr code
import { QRCodeSVG } from 'qrcode.react';

// socket
import { io } from 'socket.io-client';

// ui - atoms
import Heading from '@/ui/atoms/heading';

// ui - molecules
import ContainerGroup from '@/ui/molecules/containerGroup';
import Container from '@/ui/molecules/container';

import 'animate.css';

export default function Monitor() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tilt, setTilt] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a random ID for the session
    const randomId = Math.random().toString(36).substring(2, 8);
    setSessionId(randomId);

    setHasMounted(true);
    const serverUrl =
      process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3041';
    console.log('Connecting to socket server:', serverUrl);
    const socket = io(serverUrl);

    socket.on('connect', () => {
      console.log('Socket connected! ID:', socket.id);
      socket.emit('joinSession', randomId);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('updateDisplay', (data) => {
      setTilt(data.angle); // Receive tilt from phone
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Wait until both mounted and sessionId is ready
  if (!hasMounted || !sessionId) return null;

  // Use tunnel URL for phone access, fallback to current origin
  const tunnelUrl =
    process.env.NEXT_PUBLIC_TUNNEL_URL || window.location.origin;
  const qrUrl = `${tunnelUrl}/control/${sessionId}`;

  return (
    <>
      <ContainerGroup>
        <Container>
          <Heading level={1}>求籤</Heading>
          <div
            className="relative flex items-center justify-center w-64 h-64 my-10 transition-transform duration-75 ease-linear"
            style={{ transform: `rotate(${tilt}deg)` }}
          >
            <Image src="/draw.jpeg" alt="draw Image" width={150} height={150} />
          </div>
        </Container>
      </ContainerGroup>

      <ContainerGroup>
        <Container>
          <QRCodeSVG value={qrUrl} size={140} />
          <p>Scan to Connect</p>
          <p>
            Session: <span className="text-red-500">{sessionId}</span>
          </p>
        </Container>
      </ContainerGroup>
    </>
  );
}
