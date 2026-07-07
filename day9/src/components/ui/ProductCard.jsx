import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { Heart } from 'lucide-react';

export function ProductCard({ id, name, price, category, imageUrl, tag, description }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ id, name, price, category, imageUrl, tag, description }));
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product: { id, name, price, category, imageUrl, tag, description },
      size: 'UK 9'
    }));
  };

  const displayPrice = typeof price === 'number' ? price.toLocaleString() : price;

  return (
    <Link to={`/product/${id}`} className="group relative flex flex-col cursor-pointer bg-white">
      <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
        {tag && (
          <div className="absolute top-0 left-0 bg-white text-black text-xs font-bold px-2 py-1 z-10 border border-black m-2">
            {tag}
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 z-10 p-1 rounded-full transition-colors ${isWishlisted ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"; }}
        />
        <div className="absolute bottom-0 left-0 w-full bg-white p-3 border-t border-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full font-bold uppercase text-sm text-center hover:underline"
          >
            + Quick Add (UK 9)
          </button>
        </div>
      </div>
      <div className="pt-3 pb-4">
        <h3 className="text-sm font-bold text-black group-hover:underline line-clamp-1">{name}</h3>
        <p className="text-gray-500 text-xs mb-1 capitalize">{category}</p>
        <p className="font-bold text-sm">₹{displayPrice}</p>
      </div>
    </Link>
  );
}
