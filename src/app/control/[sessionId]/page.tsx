// metadata
export async function generateMetadata() {
  return {
    title: 'Control',
  };
}

// ui - organisms
import Control from '@/ui/organisms/control';

export default function MainPage() {
  return (
    <main role="main" id="pageControl">
      <Control />
    </main>
  );
}
