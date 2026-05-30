'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export const CartDrawer = () => {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleShopNow = () => {
    setIsCartOpen(false);
    router.push('/search');
  };

  return (
    <>
      {/* Dark Overlay Backdrop with blur */}
      <div
        className="fixed inset-0 bg-zinc-900/60 z-[60] backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-in drawer container */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 translate-x-0 animate-slide-in">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zinc-900" />
            <h2 className="text-base font-serif font-bold uppercase tracking-widest text-zinc-900">
              Your Bag ({cart.reduce((acc, item) => acc + item.cartQuantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-5 text-center">
              <div className="bg-zinc-50 p-6 rounded-full">
                <ShoppingBag className="w-10 h-10 text-zinc-300" />
              </div>
              <div>
                <p className="text-zinc-900 font-medium font-serif text-lg">Your shopping bag is empty.</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-[240px] mx-auto">
                  Add items to your bag and start curating your dream look.
                </p>
              </div>
              <button
                onClick={handleShopNow}
                className="mt-2 px-8 py-3.5 bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors duration-300 rounded-none shadow-sm"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-zinc-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="w-20 h-26 bg-zinc-50 flex-shrink-0 overflow-hidden border border-zinc-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-zinc-900 line-clamp-2 text-xs font-serif leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs font-bold text-zinc-900">
                        {formatPrice(item.price * item.cartQuantity)}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">
                      Unit: {formatPrice(item.price)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                          className="p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-8 text-center text-zinc-900">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                          className="p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 uppercase tracking-widest font-semibold text-xs">
                Subtotal
              </span>
              <span className="text-lg font-bold text-zinc-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Taxes and shipping are calculated during checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-rose-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors duration-300 shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default CartDrawer;
