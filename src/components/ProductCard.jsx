import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const isWishlisted = useSelector((s) => s.wishlist.items.some((i) => i.id === product.id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    addToast(`"${product.title.substring(0, 30)}..." added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    addToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', isWishlisted ? 'info' : 'success');
  };

  return (
    <Link to={`/products/${product.id}`} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 h-52 flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-gray-800 shadow transition-colors
            ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <span className="absolute top-3 left-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded-full capitalize">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 text-yellow-500 text-xs">
          <Star size={12} fill="currentColor" />
          <span className="font-medium">{product.rating?.rate}</span>
          <span className="text-gray-400">({product.rating?.count})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
