import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Cormorant_Garamond, Great_Vibes } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-vietnamese',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-loaded',
});

// Great Vibes — flowing copperplate script. Used for the birthday banner
// ("Happy Birthday Mỹ Hương") so it reads like a handwritten card, not a
// typographic serif.
const greatVibes = Great_Vibes({
  subsets: ['latin', 'vietnamese'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-script',
});

export const metadata: Metadata = {
  title: 'Chúc mừng sinh nhật, Mỹ Hương!',
  description:
    'Một trang nhỏ để chúc mừng sinh nhật Mỹ Hương — thổi nến, đọc lời chúc, và ăn mừng.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${cormorantGaramond.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}