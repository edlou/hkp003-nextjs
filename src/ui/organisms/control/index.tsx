'use client';

// react
import { useEffect, useRef, useState } from 'react';

// nextjs
import { useParams } from 'next/navigation';
import Image from 'next/image';

// socket
import { io, Socket } from 'socket.io-client';

// ui - molecules
import ContainerGroup from '@/ui/molecules/containerGroup';
import Container from '@/ui/molecules/container';

export default function Control() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const socketRef = useRef<Socket | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isActiveRef = useRef(true); // Track if session is active

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

    // Listen for result from monitor
    newSocket.on('displayResult', (data) => {
      setRandomNumber(data.number);
      setShowResult(true);
      // Stop sending tilt data
      isActiveRef.current = false;
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
      // Only send tilt if session is still active
      if (socket && sessionId && e.gamma !== null && isActiveRef.current) {
        socket.emit('tiltCommand', { sessionId, angle: e.gamma });
      }
    });

    alert('Sensors started! Tilt your phone.');
  };

  return (
    <>
      <ContainerGroup>
        <Container className="canvas">
          <div className="shaker">
            <button
              type="button"
              onClick={() => {
                setClicked(true);
                startSensors();
              }}
            >
              <Image
                src="/assets/i/draw.png"
                alt="Start"
                width={400}
                height={400}
              />
            </button>
            <p className={`clickHint ${clicked ? 'fadeOut' : 'fadeIn'}`}>
              Click
            </p>
          </div>

          {/* Result from monitor */}
          {showResult && (
            <div className="result">
              <span>{randomNumber}</span>
            </div>
          )}

          <div className="qrInfo">
            <p>Session: {sessionId}</p>
          </div>
        </Container>
      </ContainerGroup>
    </>
  );
}
