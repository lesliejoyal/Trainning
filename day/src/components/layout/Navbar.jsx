import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';

// Adibas Mountain Logo (Adidas style)
const AdibasLogo = () => (
  <svg width="60" height="40" viewBox="0 0 100 65" fill="black" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6 62.3L2.2 40.5L16.8 32.2L29.2 54L14.6 62.3Z" />
    <path d="M38.8 62.3L16.2 22.5L30.8 14.2L53.4 54L38.8 62.3Z" />
    <path d="M63.1 62.3L30.1 4.5L44.7 -3.8147e-06L77.7 54L63.1 62.3Z" />
  </svg>
);

export function Navbar() {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      {/* Top Promo Bar */}
      <div className="bg-black text-white text-xs font-bold text-center py-2 tracking-widest cursor-pointer hover:bg-gray-800 transition-colors">
        SIGN UP & GET 10% OFF <span className="ml-1">v</span>
      </div>

      {/* Utility Nav */}
      <div className="hidden lg:flex justify-end items-center px-10 py-1 text-xs text-gray-500 space-x-4 border-b border-gray-100">
        <Link to="/contact" className="hover:underline">help</Link>
        <Link to="/orders" className="hover:underline">orders and returns</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="hover:underline">sign up</Link>
            <Link to="/login" className="hover:underline">log in</Link>
          </>
        ) : (
          <>
            <span className="font-bold text-black uppercase">Member</span>
            {isAdmin && <Link to="/admin" className="hover:underline font-bold text-blue-600">Admin Dashboard</Link>}
            <Link to="/dashboard" className="hover:underline">dashboard</Link>
            <button onClick={() => { dispatch(logout()); navigate('/'); }} className="hover:underline">log out</button>
          </>
        )}
      </div>

      {/* Main Nav */}
      <div className="flex items-center justify-between px-4 lg:px-10 h-16 border-b border-gray-200">
        
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center">
          <button className="lg:hidden mr-4" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-end mt-2">
            <AdibasLogo />
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2 top-4 h-full pt-2">
          <Link to="/shop?category=Football" className="text-sm font-bold tracking-wider uppercase border-b-2 border-transparent hover:border-black h-full flex items-center">Football</Link>
          <Link to="/shop?category=Cricket" className="text-sm font-bold tracking-wider uppercase border-b-2 border-transparent hover:border-black h-full flex items-center">Cricket</Link>
          <Link to="/shop?category=Running" className="text-sm font-bold tracking-wider uppercase border-b-2 border-transparent hover:border-black h-full flex items-center">Running</Link>
          <Link to="/shop" className="text-sm tracking-wider uppercase border-b-2 border-transparent hover:border-black h-full flex items-center">Originals</Link>
        </nav>

        {/* Right Icons & Search */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-48 lg:w-56 bg-gray-100 rounded-none h-10 items-center px-3 border border-transparent focus-within:border-black transition-colors">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-black placeholder-gray-500"
            />
            <button type="submit">
              <Search className="w-5 h-5 text-gray-700 cursor-pointer" />
            </button>
          </form>
          <Link to="/dashboard" className="text-gray-900 hover:text-gray-600">
            <User className="w-6 h-6" />
          </Link>
          <Link to="/wishlist" className="text-gray-900 hover:text-gray-600 relative">
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="text-gray-900 hover:text-gray-600 relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <AdibasLogo />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-4 flex flex-col space-y-4">
              <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="flex relative w-full bg-gray-100 rounded-none h-12 items-center px-3 mb-4">
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-base text-black placeholder-gray-500"
                />
                <button type="submit"><Search className="w-5 h-5 text-gray-700" /></button>
              </form>
              <Link to="/shop?category=Football" className="font-bold text-lg uppercase tracking-wide border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Football</Link>
              <Link to="/shop?category=Cricket" className="font-bold text-lg uppercase tracking-wide border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Cricket</Link>
              <Link to="/shop?category=Running" className="font-bold text-lg uppercase tracking-wide border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Running</Link>
              <Link to="/shop" className="text-lg uppercase tracking-wide border-b border-gray-100 pb-2" onClick={() => setIsMobileMenuOpen(false)}>Originals</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
