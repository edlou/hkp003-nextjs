'use client';

// nextjs
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ui - atoms
import Heading from '@/ui/atoms/heading';
import FormField from '@/ui/atoms/formField';

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
        <Container>
          <Heading level={1}>求籤</Heading>

          <Image src="/assets/i/logo.png" alt="Logo" width={600} height={300} />

          <div>
            <FormField
              type="button"
              fieldData={{
                type: 'submit',
                id: 'btEnter',
                value: 'Enter',
                className: 'primary',
                onClick: handleStart,
              }}
            />
          </div>
        </Container>
      </ContainerGroup>
    </>
  );
}
