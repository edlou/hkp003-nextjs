'use client';
import Link from 'next/link';
import Image from 'next/image';
import 'animate.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LandingPage() {

  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const handleStart = () => {
    // 2. Trigger the "clicked" state
    setIsTransitioning(true);

    // 3. Wait for the animation (e.g., 800ms) then navigate
    setTimeout(() => {
      router.push('/monitor'); // Ensure this matches your folder name (display or monitor)
    }, 800);
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen ">
      {/* Container for content */}
      <div className={`flex flex-col items-center justify-center border-4 border-red-600 w-fit h-fit px-10 py-12 rounded-3xl animate__animated  ${isTransitioning ? 'animate__fadeOutUp' : ''}`}>

                {/* Title Section */}
        <div className=" items-center mb-6 ">
          <h1 className="text-6xl font-bold text-center text-red-600 ">
            求籤 app
          </h1>
        </div>

        <div className=''>
          <Image src="/cartoonChar.svg" alt="3 god Image" width={300} height={300} className="mx-auto mb-6 animate__animated animate__heartBeat" />
        </div>

        {/* Action Button */}
        <div className="">

            <button onClick={handleStart} className="hover:scale-110 active:scale-95 transition-transform">
              <Image src="/startButton.jpg" alt="Star Image" width={300} height={300} className="mx-auto" />
            </button>
        </div>

        <div>
          <p className="text-center text-2xl font-bold text-gray-600">
            Click the button to start
          </p>
        </div>


      </div>
    </main>
  );
}