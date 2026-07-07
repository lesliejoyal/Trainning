import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProductCard } from '../components/ui/ProductCard';

export function Wishlist() {
  const wishlistItems = useSelector(state => state.wishlist.items);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight italic">My Wishlist</h1>
          <p className="font-bold text-sm text-gray-500 mt-1">{wishlistItems.length} ITEM{wishlistItems.length !== 1 ? 'S' : ''}</p>
        </div>
        {wishlistItems.length > 0 && (
          <Link to="/shop" className="text-sm font-black uppercase underline hover:no-underline">
            Continue Shopping →
          </Link>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-24 border border-gray-200 bg-gray-50">
          <p className="text-6xl mb-5">❤️</p>
          <h2 className="text-2xl font-black uppercase mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
            Browse our collections and heart the products you love. They'll appear here for easy access.
          </p>
          <Link to="/shop">
            <button className="bg-black text-white font-black uppercase tracking-wider py-4 px-8 hover:bg-gray-800 transition-colors text-sm">
              Discover Products →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
