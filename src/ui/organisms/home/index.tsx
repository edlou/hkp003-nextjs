'use client';

// nextjs
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ui - molecules
import ContainerGroup from '@/ui/molecules/containerGroup';
import Container from '@/ui/molecules/container';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    // delay 800ms before redirecting
    setTimeout(() => {
      router.push('/monitor');
    }, 800);
  };
  return (
    <>
      <ContainerGroup>
        <Container className="full">
          <div className="buttonDraw">
            <button type="button" onClick={() => handleStart()}>
              <Image
                src="/assets/i/draw.png"
                alt="Enter"
                width={200}
                height={200}
              />
            </button>
          </div>
        </Container>
      </ContainerGroup>
    </>
  );
}
