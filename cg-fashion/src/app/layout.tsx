import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';

// Premium typography from Google Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CG Fashion | Premium Luxury Fashion & Apparel',
  description: 'Discover the latest trends in our premium luxury collections. Exquisite designs crafted for your perfect moments.',
  keywords: 'fashion, apparel, luxury, shopping, beauty, fragrances',
  authors: [{ name: 'CG Fashion' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-white font-sans antialiased text-zinc-950">
        <StoreProvider>
          {/* Sticky Brand Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow flex flex-col">{children}</main>
          
          {/* Global Slide-out Shopping Bag */}
          <CartDrawer />
          
          {/* Rich Footer Directory */}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
