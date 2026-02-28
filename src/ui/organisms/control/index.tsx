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

// types
interface Reading {
  number: number;
  category: string;
  poem: string;
}

export default function Control() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const socketRef = useRef<Socket | null>(null);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
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
      setSelectedReading(data.reading);
      setShowResult(true);
      // Stop sending tilt data
      isActiveRef.current = false;
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const startSensors = async () => {
    // iOS Permission Check for DeviceMotion
    if (
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceMotionEvent as any).requestPermission();
        if (res !== 'granted') return alert('Permission denied');
      } catch (err) {
        console.error('DeviceMotion permission error:', err);
      }
    }

    // Track tilt angles based on acceleration
    let currentTiltX = 0; // forward/backward
    let currentTiltZ = 0; // rotation

    window.addEventListener('devicemotion', (e) => {
      const socket = socketRef.current;
      if (!socket || !sessionId || !isActiveRef.current) return;

      const accel = e.accelerationIncludingGravity;
      if (!accel || accel.z === null || accel.x === null) return;

      // z-axis: forward/backward tilt (phone tilting toward/away from user)
      // x-axis: side rotation (phone tilting left/right)
      const zAccel = accel.z;
      const xAccel = accel.x;

      // Convert acceleration to tilt angles
      // Increased forward/backward range to ±45 degrees
      const targetTiltX = Math.max(-45, Math.min(45, zAccel * 5));
      const targetTiltZ = Math.max(-15, Math.min(15, xAccel * 2));

      // More smoothing to reduce choppiness (0.5/0.5 for smoother motion)
      currentTiltX = currentTiltX * 0.5 + targetTiltX * 0.5;
      currentTiltZ = currentTiltZ * 0.5 + targetTiltZ * 0.5;

      socket.emit('tiltCommand', {
        sessionId,
        angleX: currentTiltX,
        angleZ: currentTiltZ
      });
    });

    alert('Sensors started! Shake your phone like a fortune stick tube!');
  };

  return (
    <>
      <ContainerGroup>
        <Container className="canvas">
          {!showResult && (
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
          )}

          {/* Result from monitor */}
          {showResult && selectedReading && (
            <>
              <div className="shaker">
                <Image
                  src="/assets/i/draw.png"
                  alt="Start"
                  width={400}
                  height={400}
                />
              </div>
              <div className="result">
                <span className="number">{selectedReading.number}</span>
                <span className="category">{selectedReading.category}</span>
                <p className="poem">{selectedReading.poem}</p>
              </div>
            </>
          )}

          <div className="qrInfo">
            <p>Session: {sessionId}</p>
          </div>
        </Container>
      </ContainerGroup>
    </>
  );
}
