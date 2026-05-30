'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, Tag, Layers, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="border-b border-zinc-100 pb-6 mb-10">
        <h1 className="text-3xl font-serif text-zinc-950 tracking-tight font-black uppercase">
          Order History
        </h1>
        <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase mt-1">
          Track and manage your past order shipments and invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-24 text-center border border-zinc-100 bg-zinc-50/50 flex flex-col items-center">
          <div className="bg-white p-6 rounded-full border border-zinc-100 mb-5">
            <Package className="w-10 h-10 text-zinc-300" />
          </div>
          <h2 className="text-lg font-serif font-bold text-zinc-950 mb-2">No orders found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
            You haven&apos;t placed any orders yet. When you buy items, they will appear here with dynamic tracking statuses.
          </p>
          <button
            onClick={() => router.push('/search')}
            className="px-8 py-3.5 bg-zinc-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-none shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div key={order.id} className="border border-zinc-200 bg-white shadow-xs rounded-sm overflow-hidden">
              
              {/* Order Header info bar */}
              <div className="bg-zinc-50/80 p-5 sm:p-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <div className="flex flex-wrap gap-6 sm:gap-10">
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-1 font-bold">Order Placed</span>
                    <span className="text-zinc-900 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(order.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-1 font-bold">Total Price</span>
                    <span className="text-zinc-900 font-extrabold">{formatPrice(order.total)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-1 font-bold">Order ID</span>
                    <span className="text-zinc-900 font-extrabold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-zinc-400" />
                      {order.id}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="inline-flex px-3.5 py-1.5 bg-green-50 text-green-700 border border-green-200 text-[9px] font-black uppercase tracking-widest">
                    {order.status}
                  </span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-5 sm:p-6 divide-y divide-zinc-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 py-5 first:pt-0 last:pb-0 cursor-pointer group"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(item.title)}`)}
                  >
                    <div className="w-16 h-22 bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 flex justify-between gap-4">
                      <div>
                        <h4 className="font-serif font-bold text-zinc-950 text-sm sm:text-base leading-tight group-hover:text-rose-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1.5 font-bold">
                          Category: {item.category.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-zinc-500 mt-2 font-medium flex items-center gap-1">
                          <Layers className="w-3 h-3 text-zinc-400" />
                          <span>Quantity: {item.cartQuantity}</span>
                        </p>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <span className="font-extrabold text-zinc-950 text-sm">
                          {formatPrice(item.price * item.cartQuantity)}
                        </span>
                        <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest group-hover:underline flex items-center justify-end gap-0.5">
                          Buy Again <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
