import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/product-card';

// Server-side pre-fetching with 1-hour cache revalidation
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=4', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch featured products');
    const data = await res.json();
    return data.products || [];
  } catch (e) {
    console.error('Error fetching featured products:', e);
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Luxury Hero Banner Section */}
      <section className="relative h-[650px] w-full bg-zinc-950 flex items-center overflow-hidden">
        {/* Curated Unsplash Luxury Fashion Background */}
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
          alt="Luxury Fashion Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 hover:scale-102 transition-transform duration-[8000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/50 to-transparent" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <span className="text-rose-500 font-bold uppercase tracking-widest text-xs sm:text-sm block mb-4 animate-fade-in">
            New Season Collection
          </span>
          <h1 className="text-5xl sm:text-7xl font-serif text-white leading-[1.08] mb-6 tracking-tight">
            Elegance <br />
            <span className="text-rose-500 italic font-light">Redefined.</span>
          </h1>
          <p className="text-zinc-200 text-sm sm:text-base max-w-lg mb-10 font-medium leading-relaxed">
            Discover the latest runway trends in our luxury collections. Exquisite designs crafted to make every one of your perfect moments look stunning.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg hover:shadow-rose-600/30"
          >
            <span>Shop Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Premium Circular Curated Categories */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-rose-600 font-semibold tracking-wider text-xs uppercase block mb-2">
          Curated Styles
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 mb-2 uppercase tracking-wider font-bold">
          Celebrate Every Occasion in Style
        </h2>
        <div className="w-12 h-0.5 bg-rose-600 mx-auto mb-14" />

        <div className="flex justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 scrollbar-hide">
          {[
            {
              name: 'Beauty',
              slug: 'beauty',
              img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=200&h=200&fit=crop',
            },
            {
              name: 'Fragrances',
              slug: 'fragrances',
              img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=200&h=200&fit=crop',
            },
            {
              name: 'Furniture',
              slug: 'furniture',
              img: 'https://images.unsplash.com/photo-1505693314120-0d4438670918?q=80&w=200&h=200&fit=crop',
            },
            {
              name: 'Groceries',
              slug: 'groceries',
              img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&h=200&fit=crop',
            },
            {
              name: 'Smartphones',
              slug: 'smartphones',
              img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&h=200&fit=crop',
            },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={`/search?category=${encodeURIComponent(cat.slug)}`}
              className="flex flex-col items-center cursor-pointer group flex-shrink-0"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 border-2 border-zinc-100 group-hover:border-rose-500 transition-all duration-300 p-1">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-zinc-800 group-hover:text-rose-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection Grid (Server Side Fetched) */}
      <section className="bg-zinc-50/50 border-y border-zinc-100 py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-rose-600 font-semibold tracking-wider text-xs uppercase block mb-1">
                Trending Now
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 uppercase tracking-wider font-bold">
                New Arrivals
              </h2>
              <div className="w-12 h-0.5 bg-rose-600 mt-2" />
            </div>
            <Link
              href="/search"
              className="group text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              No products available at the moment. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* High-End Testimonial Review Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <span className="text-rose-600 font-semibold tracking-wider text-xs uppercase block mb-2">
            Customer Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 mb-14 uppercase tracking-wider font-bold">
            Hear It From Our Customers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Jenkins',
                quote: 'Absolutely stunning collection! The quality exceeded my expectations. I will definitely be purchasing again soon.',
                initial: 'S',
              },
              {
                name: 'Eleanor Vance',
                quote: 'The checkout process was flawless and priority delivery arrived on time. The fabrics are beautiful and drape nicely.',
                initial: 'E',
              },
              {
                name: 'Julianne Wilde',
                quote: 'I love how responsive their customer service is. The packaging was luxury tier and items fit perfectly according to the guidelines.',
                initial: 'J',
              },
            ].map((client, i) => (
              <div
                key={i}
                className="bg-zinc-50/50 p-8 sm:p-10 text-left border border-zinc-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <div className="flex text-amber-500 gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-600 italic text-sm leading-relaxed mb-6 font-medium">
                    &ldquo;{client.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 mt-auto">
                  <div className="w-9 h-9 bg-zinc-950 text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {client.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-950 text-sm font-serif">{client.name}</h4>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
