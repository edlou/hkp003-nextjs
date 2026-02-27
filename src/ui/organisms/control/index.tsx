'use client';

// react
import { useEffect, useRef } from 'react';

// nextjs
import { useParams } from 'next/navigation';
import Image from 'next/image';

// socket
import { io, Socket } from 'socket.io-client';

// ui - atoms
import Heading from '@/ui/atoms/heading';
import FormField from '@/ui/atoms/formField';

// ui - molecules
import ContainerGroup from '@/ui/molecules/containerGroup';
import Container from '@/ui/molecules/container';

export default function Control() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const SOCKET_SERVER =
      process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3041';
    console.log('Connecting to:', SOCKET_SERVER, 'with sessionId:', sessionId);

    const newSocket = io(SOCKET_SERVER);
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected! Joining session:', sessionId);
      newSocket.emit('joinSession', sessionId);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const startSensors = async () => {
    // iOS Permission Check
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res !== 'granted') return alert('Permission denied');
      } catch (err) {
        console.error('DeviceOrientation permission error:', err);
      }
    }

    window.addEventListener('deviceorientation', (e) => {
      const socket = socketRef.current;
      if (socket && sessionId && e.gamma !== null) {
        socket.emit('tiltCommand', { sessionId, angle: e.gamma });
      }
    });

    alert('Sensors started! Tilt your phone.');
  };

  return (
    <>
      <ContainerGroup>
        <Container>
          <Heading level={1}>求籤 Control</Heading>
          <Image
            src="/assets/i/draw.png"
            alt="draw Image"
            width={300}
            height={300}
          />
        </Container>
      </ContainerGroup>

      <ContainerGroup>
        <Container>
          <p>Session: {sessionId}</p>
          <div>
            <FormField
              type="button"
              fieldData={{
                type: 'submit',
                id: 'btStart',
                value: 'Start Control',
                onClick: startSensors,
              }}
            />
          </div>
        </Container>
      </ContainerGroup>
    </>
  );
}
