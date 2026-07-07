import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { X } from 'lucide-react';

export function Cart() {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const handleRemove = (id, size) => {
    dispatch(removeFromCart({ id, size }));
  };

  const handleQuantity = (id, size, quantity) => {
    dispatch(updateQuantity({ id, size, quantity: parseInt(quantity) }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight italic mb-8">Your Bag</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-black uppercase mb-4">Your bag is empty</h2>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between font-bold uppercase text-sm border-b-2 border-black pb-4 mb-4">
              <span>{totalItems} Items</span>
              <span>Total: ₹{subtotal.toLocaleString()}</span>
            </div>
            
            {cartItems.map((item, index) => (
              <div key={`${item.product.id}-${item.size}-${index}`} className="flex gap-4 py-6 border-b border-gray-200 relative">
                <button 
                  onClick={() => handleRemove(item.product.id, item.size)}
                  className="absolute top-6 right-0 text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-32 h-32 bg-[#ececec]">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold uppercase tracking-tight">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{item.product.category}</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">Size: {item.size}</p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <select 
                      value={item.quantity}
                      onChange={(e) => handleQuantity(item.product.id, item.size, e.target.value)}
                      className="border border-gray-300 p-2 font-bold focus:outline-none focus:border-black"
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <p className="font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-8 border border-gray-200">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm font-bold border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-xl uppercase mb-8">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="w-full block">
                <Button className="w-full justify-center">Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
