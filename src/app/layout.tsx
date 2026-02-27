// react
import { type ReactNode } from 'react';

// styles
import '@/app/globals.css';

// nextjs
import type { Metadata } from 'next';
import Script from 'next/script';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | ' + '求籤 - efx design',
      default: '求籤 - efx design',
    },
    description: '求籤',
    icons: {
      icon: [
        {
          media: '(prefers-color-scheme: light)',
          url: '/assets/i/brand/favicon_light.ico',
          href: '/assets/i/brand/favicon_light.svg',
        },
        {
          media: '(prefers-color-scheme: dark)',
          url: '/assets/i/brand/favicon_dark.ico',
          href: '/assets/i/brand/favicon_dark.svg',
        },
      ],
    },
  };
}

interface LayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en-US">
      <body className={notoSans.className}>
        {children}

        <Script
          id="set-page-id"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function updatePageId() {
                  try {
                    const pathname = window.location.pathname;
                    const pageId =
                      'page' +
                      (pathname === '/'
                        ? 'Home'
                        : pathname
                            .slice(1)
                            .split('/')
                            .map(part => part[0].toUpperCase() + part.slice(1))
                            .join(''));
                    
                    document.body.id = pageId;
                    
                    const logoLink = document.querySelector('[data-logo-link]');
                    if (logoLink) {
                      logoLink.classList.toggle('notLink', pageId === 'pageHome');
                    }
                  } catch (e) {
                    console.error('Error setting page ID:', e);
                  }
                }

                // Initial update on load
                updatePageId();

                // Listen for history changes (pushState / replaceState)
                const pushState = history.pushState;
                history.pushState = function() {
                  pushState.apply(this, arguments);
                  updatePageId();
                };

                const replaceState = history.replaceState;
                history.replaceState = function() {
                  replaceState.apply(this, arguments);
                  updatePageId();
                };

                // Listen for back/forward navigation
                window.addEventListener('popstate', updatePageId);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
