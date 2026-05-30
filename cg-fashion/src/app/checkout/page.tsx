'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Loader2, CreditCard, Shield } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, placeOrder } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);
  const tax = subtotal * 0.08; // 8% Tax rate
  const total = subtotal + tax;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate real credit card processor latency
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        date: new Date().toISOString(),
        items: [...cart],
        total: total,
        status: 'Processing',
      };
      
      placeOrder(newOrder);
      setConfirmedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setSuccess(true);
    }, 1800);
  };

  if (success && confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in flex flex-col items-center">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-200">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif text-zinc-950 mb-3 tracking-tight font-black uppercase">
          Order Confirmed
        </h1>
        <p className="text-zinc-500 text-sm mb-2 font-medium">
          Thank you for shopping with CG Fashion. Your transaction has been secured.
        </p>
        <p className="text-xs text-zinc-400 mb-8 font-semibold tracking-wider">
          ORDER NUMBER: <span className="text-zinc-900 font-bold">{confirmedOrder.id}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => router.push('/orders')}
            className="px-8 py-3.5 border border-zinc-950 text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-colors duration-300 rounded-none"
          >
            Track Order History
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors duration-300 rounded-none shadow-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-3xl font-serif mb-4 font-black uppercase tracking-wider text-zinc-950">Checkout</h1>
        <p className="text-zinc-500 text-sm mb-8 font-medium">Your shopping bag is currently empty.</p>
        <button
          onClick={() => router.push('/search')}
          className="px-8 py-3.5 bg-zinc-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-none shadow-sm"
        >
          Discover Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-100">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-serif text-zinc-950 tracking-tight font-black uppercase">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Shipping Form Input Area */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handlePayment} className="space-y-10">
            
            {/* Step 1: Shipping */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3.5 text-zinc-900">
                <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                Shipping Coordinates
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <input
                    required
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    required
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    required
                    type="text"
                    placeholder="Address Line 1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    required
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    required
                    type="text"
                    placeholder="ZIP Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="border-t border-zinc-100 pt-8">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3.5 text-zinc-900">
                <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                Secure Billing (Dummy Validation)
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    required
                    type="text"
                    maxLength={16}
                    placeholder="Card Number (e.g. 4000123456789010)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <input
                      required
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      required
                      type="text"
                      maxLength={3}
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-rose-500 text-xs font-medium rounded-none bg-zinc-50/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                <Shield className="w-3.5 h-3.5 text-green-600" />
                <span>Your checkout data is encrypted and secure</span>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary Pricing Breakdown */}
        <div className="lg:col-span-5 sticky top-24 bg-zinc-50 border border-zinc-200 p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-6 pb-3 border-b border-zinc-200">
            Order Review
          </h2>
          
          {/* Scrollable list of items */}
          <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                <div className="w-14 h-18 bg-white overflow-hidden border border-zinc-100 flex-shrink-0">
                  <img src={item.thumbnail} className="w-full h-full object-cover" alt={item.title} />
                </div>
                <div className="flex-1 text-xs">
                  <h4 className="font-semibold text-zinc-950 line-clamp-1">{item.title}</h4>
                  <p className="text-zinc-400 mt-1">Qty: {item.cartQuantity}</p>
                  <p className="font-bold text-zinc-900 mt-1">{formatPrice(item.price * item.cartQuantity)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Prices Breakdown */}
          <div className="border-t border-zinc-200 pt-5 space-y-3.5 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-zinc-900 font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="text-zinc-900 font-bold">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping cost</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-950 pt-5 border-t border-zinc-200">
              <span>Total Price</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isProcessing}
            className={`w-full mt-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 duration-300 shadow-md ${
              isProcessing
                ? 'bg-zinc-400 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-600/20'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order {formatPrice(total)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
