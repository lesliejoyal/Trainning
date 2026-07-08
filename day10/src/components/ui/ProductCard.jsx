import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { Heart } from 'lucide-react';

export function ProductCard({ 
  id, 
  name, 
  price, 
  category, 
  imageUrl, 
  tag, 
  description,
  originalPrice,
  discountPercentage,
  colorsCount,
  promoText,
  genderCategory
}) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ id, name, price, category, imageUrl, tag, description }));
  };

  const formatPrice = (p) => {
    if (typeof p !== 'number') return p;
    // Format to match Adidas style e.g., ₹15 999.00
    const str = p.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₹${str.replace(',', ' ')}`; 
  };

  const isDiscounted = originalPrice && discountPercentage;

  return (
    <Link to={`/product/${id}`} className="group relative flex flex-col cursor-pointer bg-white group">
      <div className="relative aspect-square bg-[#eceff1] overflow-hidden">
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 transition-colors ${isWishlisted ? 'text-black' : 'text-gray-500 hover:text-black'}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={isWishlisted ? 2 : 1.5} />
        </button>
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"; }}
        />
        <div className="absolute bottom-0 left-0 w-full bg-white p-3 border-t border-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <div className="w-full font-bold uppercase text-sm text-center">
            View Details
          </div>
        </div>
      </div>
      
      <div className="pt-3 pb-4 px-1 flex flex-col">
        {/* Price Section */}
        <div className="mb-1 flex flex-col">
          {isDiscounted ? (
            <>
              <span className="font-semibold text-red-600 text-sm tracking-tight">{formatPrice(price)}</span>
              <span className="text-gray-500 text-xs tracking-tight">
                <span className="line-through">{formatPrice(originalPrice)}</span> Original price <span className="text-red-600">{discountPercentage}</span>
              </span>
            </>
          ) : (
            <span className="font-semibold text-sm tracking-tight">{formatPrice(price)}</span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-[13px] text-gray-900 leading-tight mb-1">{name}</h3>
        
        {/* Category & Colors */}
        <p className="text-gray-500 text-xs mb-0.5">{genderCategory || category}</p>
        {colorsCount && <p className="text-gray-500 text-xs mb-0.5">{colorsCount}</p>}
        
        {/* Tags / Promo Text */}
        {(tag || promoText) && (
          <p className="text-gray-900 text-xs mt-1">
            {tag}{tag && promoText ? ' · ' : ''}{promoText}
          </p>
        )}
      </div>
    </Link>
  );
}
