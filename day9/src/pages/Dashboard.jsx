import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const orders = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'My Orders' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-1/4 flex-shrink-0">
          {/* Profile Card */}
          <div className="bg-black text-white p-6 mb-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4">
              <span className="text-black font-black text-xl">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
            <h2 className="font-black uppercase text-lg leading-tight">{user?.name || 'Member'}</h2>
            <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
            <div className="mt-3 border-t border-white/20 pt-3">
              <p className="text-yellow-400 font-bold text-xs uppercase">adiClub Level 1 · 0 pts</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex flex-col border border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 text-left font-bold uppercase text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                  activeTab === tab.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-4 border-2 border-black font-bold uppercase text-sm py-3 px-4 text-left hover:bg-black hover:text-white transition-colors"
          >
            Log Out →
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">

          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight mb-8">
                Welcome back, {user?.name?.split(' ')[0] || 'Member'}!
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="border-2 border-black p-6 text-center">
                  <p className="text-4xl font-black">{orders.length}</p>
                  <p className="font-bold uppercase text-sm text-gray-500 mt-1">Items in Bag</p>
                </div>
                <div className="border-2 border-black p-6 text-center">
                  <p className="text-4xl font-black">{wishlistItems.length}</p>
                  <p className="font-bold uppercase text-sm text-gray-500 mt-1">Wishlisted</p>
                </div>
                <div className="border-2 border-black p-6 text-center">
                  <p className="text-4xl font-black text-yellow-500">0</p>
                  <p className="font-bold uppercase text-sm text-gray-500 mt-1">adiClub Points</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/cart" className="border border-gray-200 p-6 hover:border-black transition-colors block">
                  <h3 className="font-black uppercase mb-2">Shopping Bag</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">You have {orders.length} item(s) in your bag.</p>
                  <span className="font-bold text-sm uppercase underline">View Bag →</span>
                </Link>
                <Link to="/wishlist" className="border border-gray-200 p-6 hover:border-black transition-colors block">
                  <h3 className="font-black uppercase mb-2">Wishlist</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">{wishlistItems.length} saved item(s).</p>
                  <span className="font-bold text-sm uppercase underline">View Wishlist →</span>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Order History</h1>
              <div className="border border-gray-200 p-12 text-center bg-gray-50">
                <p className="text-6xl mb-4">📦</p>
                <h2 className="font-black uppercase text-xl mb-2">No past orders yet</h2>
                <p className="text-gray-500 font-medium mb-6">When you complete a purchase, your orders will appear here.</p>
                <Link to="/shop"><Button>Start Shopping</Button></Link>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight mb-8">My Wishlist</h1>
              {wishlistItems.length === 0 ? (
                <div className="border border-gray-200 p-12 text-center bg-gray-50">
                  <p className="text-6xl mb-4">❤️</p>
                  <h2 className="font-black uppercase text-xl mb-2">Your wishlist is empty</h2>
                  <p className="text-gray-500 font-medium mb-6">Heart items you love while browsing.</p>
                  <Link to="/shop"><Button>Discover Products</Button></Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistItems.map(item => (
                    <Link key={item.id} to={`/product/${item.id}`} className="border border-gray-200 p-4 hover:border-black transition-colors block">
                      <div className="aspect-square bg-gray-100 mb-3 overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-bold text-xs uppercase truncate">{item.name}</p>
                      <p className="text-sm font-bold mt-1">₹{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Account Settings</h1>
              <div className="space-y-6 max-w-lg">
                <div className="border border-gray-200 p-6">
                  <h3 className="font-black uppercase mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-bold text-gray-500 uppercase">Name</span>
                      <span className="font-bold text-sm">{user?.name || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-bold text-gray-500 uppercase">Email</span>
                      <span className="font-bold text-sm">{user?.email || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-bold text-gray-500 uppercase">Member Since</span>
                      <span className="font-bold text-sm">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full border-2 border-red-500 text-red-500 font-black uppercase py-3 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Log Out of Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
