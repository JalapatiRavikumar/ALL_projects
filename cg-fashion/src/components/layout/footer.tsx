'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);


export const Footer = () => {
  const router = useRouter();

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/search?category=${encodeURIComponent(categorySlug)}`);
  };

  return (
    <footer className="bg-zinc-950 text-white mt-auto border-t border-zinc-900">
      
      {/* Brand Value Props Sub-footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start text-zinc-300">
            <Truck className="w-6 h-6 text-rose-500 mb-3" />
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-1">Free Delivery</h4>
            <p className="text-xs text-zinc-500">On all worldwide orders over $150. Fast priority shipping.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-zinc-300">
            <RotateCcw className="w-6 h-6 text-rose-500 mb-3" />
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-1">30 Days Returns</h4>
            <p className="text-xs text-zinc-500">Return items within 30 days for an easy, stress-free exchange.</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-zinc-300">
            <ShieldCheck className="w-6 h-6 text-rose-500 mb-3" />
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-1">Secure Checkout</h4>
            <p className="text-xs text-zinc-500">100% encrypted standard PCI security compliant transactions.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="bg-rose-600 px-2.5 py-1 text-white font-serif font-black text-xl leading-none">
                CG
              </div>
              <span className="font-serif font-black text-2xl tracking-tighter text-white">
                Fashion.
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Discover the absolute highest quality and aesthetic styling from the runway. Exquisite fashion tailored to elevate your standard presence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-zinc-900 hover:bg-rose-600 transition-colors text-zinc-400 hover:text-white rounded-none">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 hover:bg-rose-600 transition-colors text-zinc-400 hover:text-white rounded-none">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 hover:bg-rose-600 transition-colors text-zinc-400 hover:text-white rounded-none">
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Shop Col */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-5">Shop Collections</h5>
            <ul className="space-y-3.5 text-xs text-zinc-400">
              {['Beauty', 'Fragrances', 'Furniture', 'Groceries'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat.toLowerCase())}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-5">Information</h5>
            <ul className="space-y-3.5 text-xs text-zinc-400">
              {['About Us', 'Contact Details', 'Privacy Policy', 'Terms & Conditions', 'FAQ Directory'].map((info) => (
                <li key={info}>
                  <a href="#" className="hover:text-rose-500 transition-colors">{info}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-5">Newsletter</h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Subscribe to unlock premium collection updates and 20% off promotions.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                required
                placeholder="Enter email..."
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors rounded-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-rose-600 hover:bg-rose-700 px-3.5 text-white transition-colors flex items-center justify-center rounded-none"
              >
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Lower copyright */}
        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-widest">
          <div>
            © {new Date().getFullYear()} CG Fashion Global Ltd. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-rose-500">Security</a>
            <a href="#" className="hover:text-rose-500">Sitemap</a>
            <a href="#" className="hover:text-rose-500">Cookies Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
