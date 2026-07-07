import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Checkout() {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleOrder = (e) => {
    e.preventDefault();
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 font-bold text-lg mb-8 max-w-md">
          Thank you for shopping with Adibas. Your order is being processed and will be delivered soon.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/orders">
            <Button>View Orders</Button>
          </Link>
          <Link to="/">
            <Button variant="white">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-3xl font-black uppercase mb-4">Your bag is empty</h1>
        <Link to="/shop"><Button>Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight italic mb-8">Checkout</h1>

      <form onSubmit={handleOrder}>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3 space-y-12">

            {/* Step 1: Shipping Address */}
            <div>
              <h2 className="text-2xl font-black uppercase mb-6">1. Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name *" required />
                <Input placeholder="Last Name *" required />
                <div className="col-span-2">
                  <Input placeholder="Street Address *" required />
                </div>
                <Input placeholder="City *" required />
                <Input placeholder="Postal Code *" required />
                <div className="col-span-2">
                  <Input placeholder="Mobile Number *" required />
                </div>
                <div className="col-span-2">
                  <Input placeholder="Email *" type="email" required />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div>
              <h2 className="text-2xl font-black uppercase mb-6">2. Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-black bg-gray-50 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-black" />
                  <span className="ml-4 font-bold uppercase">Credit / Debit Card</span>
                </label>
                <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:border-black transition-colors">
                  <input type="radio" name="payment" className="w-4 h-4 accent-black" />
                  <span className="ml-4 font-bold uppercase">UPI / Net Banking</span>
                </label>
                <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:border-black transition-colors">
                  <input type="radio" name="payment" className="w-4 h-4 accent-black" />
                  <span className="ml-4 font-bold uppercase">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-8 border border-gray-200 sticky top-24">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cartItems.map((item, i) => (
                  <div key={`${item.product.id}-${item.size}-${i}`} className="flex gap-3 items-start border-b border-gray-100 pb-4">
                    <div className="w-16 h-16 bg-[#ececec] flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs uppercase truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                      <p className="font-bold text-xs mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm font-bold border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-xl uppercase mb-8">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white font-black uppercase tracking-wider py-4 px-8 hover:bg-gray-800 transition-colors text-sm"
              >
                Place Order →
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
