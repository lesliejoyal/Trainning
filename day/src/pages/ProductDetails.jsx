import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../components/ui/Button';
import { Heart } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const product = useSelector(state => state.products.items.find(p => p.id === parseInt(id)));
  const wishlistItems = useSelector(state => state.wishlist.items);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState('');

  if (!product) {
    return <div className="text-center py-20 font-black text-2xl uppercase">Product Not Found</div>;
  }

  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const sizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    setError('');
    dispatch(addToCart({ product, size: selectedSize }));
    navigate('/cart');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Product Image */}
      <div className="w-full md:w-2/3 bg-[#ececec] flex items-center justify-center p-8 aspect-square relative">
        {product.tag && (
          <div className="absolute top-4 left-4 bg-white text-black text-sm font-bold px-3 py-1 border border-black z-10">
            {product.tag}
          </div>
        )}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/3 flex flex-col pt-4">
        <nav className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
          <Link to="/" className="hover:underline hover:text-black">Home</Link> / 
          <Link to={`/shop?category=${product.category.split(' ')[0]}`} className="hover:underline hover:text-black ml-1">{product.category}</Link>
        </nav>
        
        <h1 className="text-3xl font-black uppercase tracking-tight italic mb-2">{product.name}</h1>
        <p className="text-xl font-bold mb-6">₹{product.price.toLocaleString()}</p>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold uppercase tracking-wide text-sm">Sizes</h3>
            <span className="text-xs font-bold underline cursor-pointer">Size Guide</span>
          </div>
          {error && <p className="text-red-600 font-bold text-sm mb-2">{error}</p>}
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 border text-sm font-bold transition-colors ${
                  selectedSize === size 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 justify-center" onClick={handleAddToCart}>Add To Bag</Button>
          <button 
            onClick={handleWishlist}
            className={`border-2 border-black p-4 transition-colors ${isWishlisted ? 'bg-black text-white' : 'hover:bg-gray-100 bg-white text-black'}`}
          >
            <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 space-y-4 text-sm">
          <details className="group cursor-pointer" open>
            <summary className="font-bold uppercase flex justify-between items-center outline-none">
              Description
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-700 leading-relaxed font-medium">
              {product.description}
            </p>
          </details>
          <hr className="border-gray-200" />
          <details className="group cursor-pointer">
            <summary className="font-bold uppercase flex justify-between items-center outline-none">
              Details
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <ul className="mt-4 list-disc pl-5 text-gray-700 font-medium space-y-1">
              <li>Regular fit</li>
              <li>Lace closure</li>
              <li>Premium materials</li>
              <li>Imported</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
