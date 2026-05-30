'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ProfilePage() {
  const router = useRouter();
  const { orders, favorites } = useStore();

  const userMock = {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@luxury.com',
    phone: '+1 (555) 120-4321',
    joined: 'October 2025',
    address: '142 Luxury Drive, Suite 100, New York, NY 10001',
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="border-b border-zinc-100 pb-6 mb-10">
        <h1 className="text-3xl font-serif text-zinc-950 tracking-tight font-black uppercase">
          My Account
        </h1>
        <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase mt-1">
          Review and update your user profile, delivery locations, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Left Sidebar Menu Tab Panels */}
        <aside className="lg:col-span-1 border border-zinc-100 p-4 space-y-1.5 bg-white shadow-xs rounded-sm">
          <button
            className="w-full text-left px-4 py-3.5 bg-rose-50 text-rose-600 font-semibold border-l-2 border-rose-600 text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            <User className="w-4 h-4" />
            <span>Profile Info</span>
          </button>
          
          <button
            onClick={() => router.push('/orders')}
            className="w-full text-left px-4 py-3.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-semibold border-l-2 border-transparent hover:border-zinc-300 text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            <Package className="w-4 h-4 text-zinc-400" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => router.push('/favorites')}
            className="w-full text-left px-4 py-3.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-semibold border-l-2 border-transparent hover:border-zinc-300 text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            <Heart className="w-4 h-4 text-zinc-400" />
            <span>Wishlist ({favorites.length})</span>
          </button>

          <button
            className="w-full text-left px-4 py-3.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-semibold border-l-2 border-transparent hover:border-zinc-300 text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span>Addresses</span>
          </button>

          <button
            className="w-full text-left px-4 py-3.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-semibold border-l-2 border-transparent hover:border-zinc-300 text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Settings</span>
          </button>

          <div className="border-t border-zinc-100 my-2 pt-2">
            <button
              onClick={() => router.push('/')}
              className="w-full text-left px-4 py-3.5 text-red-600 hover:bg-red-50/50 font-semibold border-l-2 border-transparent hover:border-red-300 text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-3 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Dashboard panel */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Welcome User details card */}
          <div className="bg-zinc-950 text-white p-8 sm:p-10 shadow-md flex flex-col sm:flex-row justify-between sm:items-center gap-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mb-2 uppercase">
                Hello, {userMock.name}
              </h2>
              <p className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
                Loyalty Member • Joined {userMock.joined}
              </p>
            </div>
            <div className="relative z-10 flex gap-6 text-center text-xs uppercase tracking-widest font-bold">
              <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 min-w-[100px]">
                <span className="block text-lg font-black text-rose-500">{orders.length}</span>
                <span className="text-[9px] text-zinc-400 font-semibold mt-1 block">Orders</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 min-w-[100px]">
                <span className="block text-lg font-black text-rose-500">{favorites.length}</span>
                <span className="text-[9px] text-zinc-400 font-semibold mt-1 block">Saved</span>
              </div>
            </div>
          </div>

          {/* User profile parameters form */}
          <div className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-6 pb-2.5 border-b border-zinc-100">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Full Name</span>
                <span className="text-zinc-900 font-bold text-sm block py-1">{userMock.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Email Address</span>
                <span className="text-zinc-900 font-bold text-sm block py-1 normal-case">{userMock.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Contact Number</span>
                <span className="text-zinc-900 font-bold text-sm block py-1">{userMock.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Default Address</span>
                <span className="text-zinc-900 font-bold text-sm block py-1 normal-case leading-relaxed">
                  {userMock.address}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => router.push('/orders')}
              className="border border-zinc-200 bg-white p-6 hover:border-zinc-900 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <Package className="w-6 h-6 text-zinc-400 group-hover:text-rose-500 transition-colors mb-4" />
              <div>
                <h4 className="font-serif font-bold text-zinc-900 group-hover:text-rose-600 transition-colors uppercase text-sm">
                  View Order Logs
                </h4>
                <p className="text-[10px] text-zinc-400 tracking-wider uppercase mt-1">
                  Track recent priority shipments and review invoices
                </p>
              </div>
            </div>
            
            <div
              onClick={() => router.push('/favorites')}
              className="border border-zinc-200 bg-white p-6 hover:border-zinc-900 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <Heart className="w-6 h-6 text-zinc-400 group-hover:text-rose-500 transition-colors mb-4" />
              <div>
                <h4 className="font-serif font-bold text-zinc-900 group-hover:text-rose-600 transition-colors uppercase text-sm">
                  View Saved Wishlist
                </h4>
                <p className="text-[10px] text-zinc-400 tracking-wider uppercase mt-1">
                  View saved collection items and quickly add to bag
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
