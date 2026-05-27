import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { selectedProduct: product, productStatus } = useSelector((s) => s.products);
  const isWishlisted = useSelector((s) => s.wishlist.items.some((i) => i.id === product?.id));

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [id]);

  if (productStatus === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96" />
          <div className="flex flex-col gap-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    addToast(`"${product.title.substring(0, 30)}..." added to cart`);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    addToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', isWishlisted ? 'info' : 'success');
  };

  const ratingPercent = (product.rating?.rate / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-10 h-96">
            <img src={product.image} alt={product.title} className="max-h-full object-contain" />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 capitalize">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(product.rating?.rate) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating?.rate}</span>
              <span className="text-sm text-gray-400">({product.rating?.count} reviews)</span>
            </div>

            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${product.price?.toFixed(2)}</p>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="flex flex-col gap-2">
              {[{ icon: Truck, text: 'Free shipping on orders over $50' }, { icon: ShieldCheck, text: 'Secure & encrypted payment' }].map(
                ({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon size={15} className="text-indigo-500" /> {text}
                  </div>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl border-2 transition-colors ${isWishlisted
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                  : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-500'
                  }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
