import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import './globals.css';
import InstallPrompt from '@/components/shared/InstallPrompt';
import Script from 'next/script';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Studioflow  CRM for Creative Professionals',
  description: 'The all-in-one CRM built specifically for tattoo artists, photographers, and creative professionals.',
  keywords: ['CRM', 'tattoo', 'photography', 'creative professionals', 'client management'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <InstallPrompt />
          <Script
            id="sw-register"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js')); }`,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
