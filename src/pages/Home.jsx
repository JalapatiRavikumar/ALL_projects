import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

const BANNERS = [
  { title: "Summer Sale", subtitle: "Up to 50% off on electronics", bg: "from-indigo-600 to-purple-600", cta: "Shop Electronics" },
  { title: "New Arrivals", subtitle: "Explore the latest fashion trends", bg: "from-rose-500 to-pink-600", cta: "Shop Fashion" },
  { title: "Premium Jewellery", subtitle: "Luxury pieces at great prices", bg: "from-amber-500 to-orange-600", cta: "Shop Jewellery" },
];

const PERKS = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
  { icon: RefreshCw, label: 'Easy Returns', desc: '30-day return policy' },
  { icon: ShieldCheck, label: 'Secure Payment', desc: 'SSL encrypted checkout' },
  { icon: Headphones, label: '24/7 Support', desc: 'Always here to help' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, categories } = useSelector((s) => s.products);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts());
    if (categories.length === 0) dispatch(fetchCategories());
  }, []);

  const featured = items.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Banners */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BANNERS.map((b, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${b.bg} rounded-2xl p-6 text-white flex flex-col gap-3 ${i === 0 ? 'md:col-span-2 py-10' : ''}`}
            >
              <h2 className={`font-bold ${i === 0 ? 'text-3xl' : 'text-xl'}`}>{b.title}</h2>
              <p className="text-white/80 text-sm">{b.subtitle}</p>
              <Link
                to="/products"
                className="self-start flex items-center gap-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {b.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PERKS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Browse Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 capitalize transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {status === 'loading'
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>
    </div>
  );
}
