// metadata
export async function generateMetadata() {
  return {
    title: 'Monitor',
  };
}

// ui - organisms
import Monitor from '@/ui/organisms/monitor';

export default function MainPage() {
  return (
    <main role="main">
      <Monitor />
    </main>
  );
}
