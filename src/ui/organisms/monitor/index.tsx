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

// reading data
import readingData from '@/../public/assets/r/reading.json';

// types
interface Reading {
  number: number;
  category: string;
  poem: string;
}

// ui - molecules
import ContainerGroup from '@/ui/molecules/containerGroup';
import Container from '@/ui/molecules/container';

export default function Monitor() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [tiltX, setTiltX] = useState(0); // forward/backward
  const [tiltZ, setTiltZ] = useState(0); // rotation
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Flow states
  const [controlLoaded, setControlLoaded] = useState(false); // Step 2: control page loaded
  const [controlReady, setControlReady] = useState(false); // Step 3: user tapped to start
  const [userJoined, setUserJoined] = useState(false); // Step 3: phone connected
  const [showPhoneShake, setShowPhoneShake] = useState(false); // Step 3b: show phone shake overlay
  const [showShakePrompt, setShowShakePrompt] = useState(false); // Step 4: after animation
  const [shakingStarted, setShakingStarted] = useState(false); // Step 5: user shaking
  const [hideShakePrompt, setHideShakePrompt] = useState(false); // Step 5: fade out prompt
  const [showResult, setShowResult] = useState(false); // Step 6: show number
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [imageSelected, setImageSelected] = useState(false); // Step 6b: swap image
  const [movingBack, setMovingBack] = useState(false); // Step 7: move image back

  const hasStartedShaking = useRef(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const isActiveRef = useRef(true); // Track if we should still update tilt

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

    // Control page has loaded (user scanned QR)
    socket.on('controlJoined', () => {
      setControlLoaded(true);
    });

    // Control is ready (user tapped to start sensors)
    socket.on('controlReady', () => {
      setControlReady(true);
      setUserJoined(true);
      // Show phone shake overlay
      setShowPhoneShake(true);
      setTimeout(() => {
        setShowPhoneShake(false);
      }, 2000);
    });

    socket.on('updateDisplay', (data) => {
      // Only update tilt if session is still active
      if (isActiveRef.current) {
        setTiltX(data.angleX ?? 0);
        setTiltZ(data.angleZ ?? 0);
      }

      // Step 5: Detect shaking (significant tilt change in either axis)
      const totalMotion = Math.abs(data.angleX ?? 0) + Math.abs(data.angleZ ?? 0);
      if (!hasStartedShaking.current && totalMotion > 8) {
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

  // Step 6a: 3s after shaking starts → swap image
  useEffect(() => {
    if (shakingStarted && !imageSelected) {
      const timer = setTimeout(() => {
        setImageSelected(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shakingStarted, imageSelected]);

  // Step 6b: 2s after image swap → show number, emit to control
  useEffect(() => {
    if (imageSelected && !showResult && sessionId) {
      const timer = setTimeout(() => {
        const number = Math.floor(Math.random() * 100) + 1;
        const reading = (readingData as Reading[]).find((r) => r.number === number) || null;
        setSelectedReading(reading);
        setShowResult(true);
        // Emit result to control page (send full reading data)
        if (socketRef.current && reading) {
          socketRef.current.emit('showResult', { sessionId, reading });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [imageSelected, showResult, sessionId]);

  // Step 6c: After showing result → stop tilt updates and straighten image
  useEffect(() => {
    if (showResult) {
      isActiveRef.current = false; // Stop accepting tilt updates
      setTiltX(0);
      setTiltZ(0);
    }
  }, [showResult]);

  // Step 7: Start moving back animation 8 seconds after result shows
  useEffect(() => {
    if (showResult && !movingBack) {
      const timer = setTimeout(() => {
        setMovingBack(true);
        setImageSelected(false); // Swap back to draw.png
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showResult, movingBack]);

  // Step 8: Redirect to home after move-back animation completes (2s)
  useEffect(() => {
    if (movingBack) {
      const timer = setTimeout(() => {
        // Disconnect socket and redirect
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        router.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [movingBack, router]);

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
            className={`targetObject ${userJoined ? 'active' : ''} ${showResult ? 'straighten' : ''} ${movingBack ? 'movingBack' : ''}`}
            style={{ transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)` }}
          >
            <Image
              src={imageSelected ? '/assets/i/draw-selected.png' : '/assets/i/draw.png'}
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
          {showResult && selectedReading && !movingBack && (
            <div className="result">
              <span className="number">{selectedReading.number}</span>
              <span className="category">{selectedReading.category}</span>
            </div>
          )}

          {/* QR Code Overlay - show QR or "tap" message */}
          {!controlReady && (
            <div className="qr-overlay">
              {!controlLoaded ? (
                <>
                  <div className="qrCode">
                    <QRCodeSVG value={qrUrl} size={200} />
                  </div>
                  <div className="qrInfo">
                    <p>Session: {sessionId}</p>
                    <p className="join">Scan QR to join</p>
                  </div>
                </>
              ) : (
                <div className="qrInfo">
                  <p className="tap-prompt">Tap the 籤筒 on your phone to start</p>
                </div>
              )}
            </div>
          )}

          {/* Phone Shake Animation */}
          {showPhoneShake && (
            <div className="phone-shake-overlay">
              <Image
                src="/assets/i/phone-shake.svg"
                alt="Shake your phone"
                width={300}
                height={300}
                className="phone-shake-image"
                unoptimized
              />
              <p className="phone-shake-message">Shake the 籤筒!</p>
            </div>
          )}
        </Container>
      </ContainerGroup>
    </>
  );
}
