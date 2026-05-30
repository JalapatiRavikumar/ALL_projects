'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, AlertCircle, Search } from 'lucide-react';
import { Product, Category, SortOption } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { ProductSkeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/lib/utils';

// Separated component to safely use useSearchParams in Next.js
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load initial params from URL
  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 500);

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOption>('default');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state if URL search query changes externally
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        const formatted = data.map((c: string | { slug: string; name: string }) =>
          typeof c === 'string'
            ? { slug: c, name: c.replace(/-/g, ' ') }
            : { slug: c.slug || '', name: c.name || (c.slug || '').replace(/-/g, ' ') }
        );
        setCategories(formatted);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products and apply filters/sorting
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();
        let fetchedProducts: Product[] = data.products || [];

        // 1. Category Filter (Local Client-side)
        if (selectedCategory) {
          fetchedProducts = fetchedProducts.filter(
            (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        // 2. Price Range Filter (Local Client-side)
        if (selectedPriceRanges.length > 0) {
          fetchedProducts = fetchedProducts.filter((p) => {
            return selectedPriceRanges.some((range) => {
              if (range === 'under-50') return p.price < 50;
              if (range === '50-100') return p.price >= 50 && p.price <= 100;
              if (range === '100-200') return p.price >= 100 && p.price <= 200;
              if (range === 'over-200') return p.price > 200;
              return true;
            });
          });
        }

        // 3. Sorting (Local Client-side)
        switch (sortOrder) {
          case 'price-asc':
            fetchedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            fetchedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating-desc':
            fetchedProducts.sort((a, b) => b.rating - a.rating);
            break;
          default:
            break;
        }

        setProducts(fetchedProducts);

        // Update URL query parameters dynamically
        const newParams = new URLSearchParams();
        if (debouncedQuery) newParams.set('q', debouncedQuery);
        if (selectedCategory) newParams.set('category', selectedCategory);
        
        const paramsString = newParams.toString();
        router.replace(`/search${paramsString ? `?${paramsString}` : ''}`, { scroll: false });

      } catch (err) {
        console.error(err);
        setError('Something went wrong while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery, selectedCategory, selectedPriceRanges, sortOrder, router]);

  const handlePriceRangeChange = (rangeId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId) ? prev.filter((id) => id !== rangeId) : [...prev, rangeId]
    );
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedPriceRanges([]);
    setSortOrder('default');
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb & Title Bar */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 font-semibold">
            <span className="hover:text-rose-600 cursor-pointer transition-colors" onClick={() => router.push('/')}>
              Home
            </span>
            <span className="mx-2 text-zinc-300">/</span>
            <span className="text-zinc-900">Shop</span>
            {selectedCategory && (
              <>
                <span className="mx-2 text-zinc-300">/</span>
                <span className="text-zinc-900 uppercase">{selectedCategory.replace(/-/g, ' ')}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-zinc-950 capitalize tracking-tight font-black">
            {query ? `Results for "${query}"` : selectedCategory ? selectedCategory.replace(/-/g, ' ') : 'All Products'}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Mobile Filter Trigger bar */}
          <div className="lg:hidden flex justify-between items-center pb-5 border-b border-zinc-100">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              {products.length} Products Found
            </span>
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 border border-zinc-200 px-5 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-zinc-50 transition-colors rounded-none"
            >
              <Filter className="w-4 h-4 text-zinc-700" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Sidebar (Responsive slides in for Mobile, static for Desktop) */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 bg-white w-80 p-8 shadow-2xl transform transition-transform duration-300 overflow-y-auto custom-scrollbar
              lg:relative lg:translate-x-0 lg:w-64 lg:p-0 lg:shadow-none lg:z-0
              ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between lg:hidden mb-8 pb-4 border-b border-zinc-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Dynamic Text Search Inside Sidebar (Great UX touch) */}
              <div className="block lg:hidden">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3.5">
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search collection..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3.5 py-2 border border-zinc-200 text-xs focus:outline-none focus:border-rose-500 rounded-none bg-zinc-50/50"
                  />
                </div>
              </div>

              {/* Sort Component Section */}
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Sort By</h3>
                <div className="space-y-3">
                  {[
                    { value: 'default', label: 'Recommended' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'rating-desc', label: 'Top Rated' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={sortOrder === option.value}
                        onChange={() => setSortOrder(option.value as SortOption)}
                        className="w-4 h-4 text-rose-600 border-zinc-300 focus:ring-rose-500 focus:ring-0 rounded-none cursor-pointer"
                      />
                      <span
                        className={`text-xs tracking-wide uppercase transition-colors ${
                          sortOrder === option.value ? 'text-zinc-900 font-bold' : 'text-zinc-500 group-hover:text-zinc-900'
                        }`}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic Categories Selection List */}
              <div className="border-t border-zinc-100 pt-8">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
                  Categories
                </h3>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-3 custom-scrollbar">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-rose-600 border-zinc-300 focus:ring-rose-500 focus:ring-0 rounded-none cursor-pointer"
                    />
                    <span
                      className={`text-xs tracking-wide uppercase transition-colors ${
                        selectedCategory === '' ? 'text-zinc-900 font-bold' : 'text-zinc-500 group-hover:text-zinc-900'
                      }`}
                    >
                      All Categories
                    </span>
                  </label>
                  
                  {categories.map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                        className="w-4 h-4 text-rose-600 border-zinc-300 focus:ring-rose-500 focus:ring-0 rounded-none cursor-pointer"
                      />
                      <span
                        className={`text-xs tracking-wide uppercase transition-colors ${
                          selectedCategory === cat.slug ? 'text-zinc-900 font-bold' : 'text-zinc-500 group-hover:text-zinc-900'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter Selection List (WORKING CLIENT FILTER) */}
              <div className="border-t border-zinc-100 pt-8">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Price</h3>
                <div className="space-y-3">
                  {[
                    { id: 'under-50', label: 'Under $50' },
                    { id: '50-100', label: '$50 - $100' },
                    { id: '100-200', label: '$100 - $200' },
                    { id: 'over-200', label: 'Over $200' },
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range.id)}
                        onChange={() => handlePriceRangeChange(range.id)}
                        className="w-4 h-4 text-rose-600 border-zinc-300 focus:ring-rose-500 rounded-xs cursor-pointer focus:ring-0"
                      />
                      <span
                        className={`text-xs tracking-wide uppercase transition-colors ${
                          selectedPriceRanges.includes(range.id)
                            ? 'text-zinc-900 font-bold'
                            : 'text-zinc-500 group-hover:text-zinc-900'
                        }`}
                      >
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                Showing 1 - {products.length} of {products.length} results
              </span>
            </div>

            {error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-100 p-8">
                <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
                <h3 className="text-base font-serif font-bold text-zinc-950 mb-2">Oops! Something went wrong</h3>
                <p className="text-xs text-zinc-400 max-w-sm mb-6">{error}</p>
                <button
                  onClick={handleClearFilters}
                  className="px-8 py-3 bg-zinc-950 hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-widest transition-colors"
                >
                  Reset Search
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center border border-zinc-100 bg-zinc-50/50 p-8">
                <div className="bg-white p-6 rounded-full shadow-xs mb-5">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-lg font-serif font-bold text-zinc-950 mb-2">No products found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mb-8 leading-relaxed">
                  We couldn&apos;t find any products matching your current search parameters. Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-8 py-3.5 bg-zinc-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 animate-fade-in">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspense Fallback
function ProductGridSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-6 bg-zinc-100 w-1/4 mb-10 rounded-sm" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="h-[400px] bg-zinc-100 rounded-sm hidden lg:block" />
        <div className="lg:col-span-3 grid grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Export default with Suspense wrapped to satisfy build checks
export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
