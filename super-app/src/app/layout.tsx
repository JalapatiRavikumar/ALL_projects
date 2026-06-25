import type { Metadata } from 'next';
import { Inter, Pacifico } from 'next/font/google';
import './globals.css';

const inter    = Inter({ subsets: ['latin'], variable: '--font-inter' });
const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
});

export const metadata: Metadata = {
  title: 'Super App – Your Personalised Entertainment Dashboard',
  description:
    'Super App — Discover movies, track weather, manage notes, set timers and read the latest news — all in one premium dashboard.',
  keywords: ['entertainment', 'movies', 'dashboard', 'weather', 'news'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${pacifico.variable}`}>
      <body className="bg-black text-white antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
