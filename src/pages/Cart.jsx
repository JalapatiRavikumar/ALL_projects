import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { incrementQty, decrementQty, removeFromCart } from '../features/cart/cartSlice';
import { useToast } from '../context/ToastContext';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const items = useSelector((s) => s.cart.items);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
    addToast(`"${item.title.substring(0, 25)}..." removed`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-6 p-8">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-6 rounded-full">
          <ShoppingBag size={48} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Add some products to get started!</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart ({items.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4 items-center">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-contain shrink-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{item.category}</p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button onClick={() => handleRemove(item)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => dispatch(decrementQty(item.id))} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => dispatch(incrementQty(item.id))} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="mt-3 block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
