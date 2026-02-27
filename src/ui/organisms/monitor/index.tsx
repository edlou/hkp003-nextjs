'use client';

// react
import { useState, useEffect, useRef } from 'react';

// nextjs
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// qr code
import { QRCodeSVG } from 'qrcode.react';

// socket
import { io } from 'socket.io-client';

// ui - molecules
import ContainerGroup from '@/ui/molecules/containerGroup';
import Container from '@/ui/molecules/container';

export default function Monitor() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [tilt, setTilt] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Flow states
  const [userJoined, setUserJoined] = useState(false); // Step 3: phone connected
  const [showShakePrompt, setShowShakePrompt] = useState(false); // Step 4: after animation
  const [shakingStarted, setShakingStarted] = useState(false); // Step 5: user shaking
  const [hideShakePrompt, setHideShakePrompt] = useState(false); // Step 5: fade out prompt
  const [showResult, setShowResult] = useState(false); // Step 6: show number
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const hasStartedShaking = useRef(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    // Generate a random ID for the session
    const randomId = Math.random().toString(36).substring(2, 8);
    setSessionId(randomId);

    setHasMounted(true);
    const serverUrl =
      process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3041';
    console.log('Connecting to socket server:', serverUrl);
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected! ID:', socket.id);
      socket.emit('joinSession', randomId);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('updateDisplay', (data) => {
      setTilt(data.angle);

      // Step 3: First update means user joined
      setUserJoined(true);

      // Step 5: Detect shaking (significant tilt change)
      if (!hasStartedShaking.current && Math.abs(data.angle) > 5) {
        hasStartedShaking.current = true;
        setShakingStarted(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Step 4: Show shake prompt after image animation completes (1.2s)
  useEffect(() => {
    if (userJoined && !showShakePrompt) {
      const timer = setTimeout(() => {
        setShowShakePrompt(true);
      }, 1200); // matches animation duration
      return () => clearTimeout(timer);
    }
  }, [userJoined, showShakePrompt]);

  // Step 5: Hide shake prompt 2 seconds after shaking starts
  useEffect(() => {
    if (shakingStarted && !hideShakePrompt) {
      const timer = setTimeout(() => {
        setHideShakePrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shakingStarted, hideShakePrompt]);

  // Step 6: Show result 5 seconds after shaking starts (2s + 3s more)
  useEffect(() => {
    if (shakingStarted && !showResult && sessionId) {
      const timer = setTimeout(() => {
        const number = Math.floor(Math.random() * 100) + 1;
        setRandomNumber(number);
        setShowResult(true);
        // Emit result to control page
        if (socketRef.current) {
          socketRef.current.emit('showResult', { sessionId, number });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [shakingStarted, showResult, sessionId]);

  // Step 7: Redirect to home 10 seconds after result shows
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        // Disconnect socket and redirect
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        router.push('/');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showResult, router]);

  // Wait until both mounted and sessionId is ready
  if (!hasMounted || !sessionId) return null;

  // Use tunnel URL for phone access, fallback to current origin
  const tunnelUrl =
    process.env.NEXT_PUBLIC_TUNNEL_URL || window.location.origin;
  const qrUrl = `${tunnelUrl}/control/${sessionId}`;

  return (
    <>
      <ContainerGroup>
        <Container className="canvas">
          <div
            className={`targetObject ${userJoined ? 'active' : ''}`}
            style={{ transform: `rotate(${tilt}deg)` }}
          >
            <Image
              src="/assets/i/draw.png"
              alt="draw Image"
              width={200}
              height={200}
            />
          </div>

          {/* Step 4 & 5: Shake prompt - shows after animation, fades out after 2s of shaking */}
          {showShakePrompt && !hideShakePrompt && (
            <div
              className={`shakePrompt ${shakingStarted ? 'fadeOut' : 'fadeIn'}`}
            >
              <Image
                src="/assets/i/phone-shake.svg"
                alt="Shake your phone"
                width={150}
                height={150}
              />
              <p>Shake your phone!</p>
            </div>
          )}

          {/* Step 6: Random number result */}
          {showResult && (
            <div className="result">
              <span>{randomNumber}</span>
            </div>
          )}

          <div className="qrCode">
            <QRCodeSVG value={qrUrl} size={50} />
          </div>
          <div className="qrInfo">
            <p>Session: {sessionId}</p>
          </div>
        </Container>
      </ContainerGroup>
    </>
  );
}
