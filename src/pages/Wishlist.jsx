import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useToast } from '../context/ToastContext';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const items = useSelector((s) => s.wishlist.items);

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
    addToast(`"${item.title.substring(0, 25)}..." moved to cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-6 p-8">
        <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full">
          <Heart size={48} className="text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Save your favourite products here!</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist ({items.length} items)</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <Link to={`/products/${item.id}`}>
                <div className="h-48 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4">
                  <img src={item.image} alt={item.title} className="h-full object-contain hover:scale-105 transition-transform" />
                </div>
              </Link>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <Link to={`/products/${item.id}`}>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-indigo-600">{item.title}</p>
                </Link>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold">${item.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition-colors"
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <button
                    onClick={() => { dispatch(removeFromWishlist(item.id)); addToast('Removed from wishlist', 'info'); }}
                    className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
