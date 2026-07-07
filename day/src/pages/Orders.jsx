import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Orders() {
  const { user } = useSelector(state => state.auth);
  const [trackInput, setTrackInput] = useState('');

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight italic mb-8">Order History</h1>

      {/* Track Order */}
      <div className="bg-gray-50 border border-gray-200 p-6 mb-10">
        <h2 className="font-black uppercase text-lg mb-4">Track Your Order</h2>
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="text"
            placeholder="Enter order number"
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
            className="flex-1 border-2 border-black p-3 font-bold outline-none focus:ring-2 focus:ring-black"
          />
          <button className="bg-black text-white font-black uppercase px-8 py-3 hover:bg-gray-800 transition-colors">
            Track
          </button>
        </div>
        {trackInput && (
          <p className="text-sm font-bold text-red-600 mt-3">
            Order #{trackInput} — Not found. Please check your order number.
          </p>
        )}
      </div>

      {/* Empty State */}
      <div className="border border-gray-200 p-16 text-center bg-gray-50">
        <p className="text-7xl mb-5">📦</p>
        <h2 className="font-black uppercase text-2xl mb-3">No Orders Yet</h2>
        <p className="text-gray-500 font-bold text-base mb-8 max-w-sm mx-auto">
          When you place an order, it will appear here. Start shopping and treat yourself!
        </p>
        <Link to="/shop"><Button>Browse Products</Button></Link>
      </div>

      {/* Policy Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        <div className="border border-gray-200 p-5">
          <h3 className="font-black uppercase text-sm mb-2">🚚 Free Delivery</h3>
          <p className="text-xs font-medium text-gray-500">Free standard delivery on all orders above ₹4999.</p>
        </div>
        <div className="border border-gray-200 p-5">
          <h3 className="font-black uppercase text-sm mb-2">🔄 Easy Returns</h3>
          <p className="text-xs font-medium text-gray-500">Return or exchange within 30 days of delivery.</p>
        </div>
        <div className="border border-gray-200 p-5">
          <h3 className="font-black uppercase text-sm mb-2">🔒 Secure Payments</h3>
          <p className="text-xs font-medium text-gray-500">All transactions are secured with 256-bit encryption.</p>
        </div>
      </div>
    </div>
  );
}
