import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../components/ui/CategoryCard';
import { ProductCard } from '../components/ui/ProductCard';

export function Home() {
  const allProducts = useSelector(state => state.products.items);

  const footballProducts = allProducts.filter(p => p.category === 'Football').slice(0, 4);
  const cricketProducts = allProducts.filter(p => p.category === 'Cricket').slice(0, 4);
  const popularProducts = allProducts.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[85vh] min-h-[500px] bg-gray-100 flex items-end justify-start overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&auto=format&fit=crop&q=80"
          alt="Adibas Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 px-6 pb-16 md:px-16 md:pb-20 max-w-3xl">
          <p className="text-white text-sm font-bold uppercase tracking-widest mb-3 opacity-80">New Arrivals</p>
          <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter mb-5 leading-none">
            END OF SEASON<br />SALE (EOSS)
          </h1>
          <p className="text-white text-xl font-bold uppercase mb-8 tracking-wide opacity-90">
            Buy 2 Get Flat 50% Off
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop?sale=true"
              className="bg-white text-black font-black uppercase tracking-wider py-4 px-8 inline-flex items-center gap-3 hover:bg-gray-100 transition-colors text-sm"
            >
              Shop Men <span>→</span>
            </Link>
            <Link
              to="/shop"
              className="bg-transparent border-2 border-white text-white font-black uppercase tracking-wider py-4 px-8 inline-flex items-center gap-3 hover:bg-white hover:text-black transition-colors text-sm"
            >
              Shop Women <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Promo Strip */}
      <div className="bg-yellow-400 py-3 text-center">
        <p className="font-black uppercase text-sm tracking-widest">
          ⚡ UP TO 50% OFF — EOSS IS HERE. <Link to="/shop?sale=true" className="underline ml-2">Shop Now →</Link>
        </p>
      </div>

      {/* Category Cards */}
      <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Shop by Sport</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          <CategoryCard
            title="Football"
            subtitle="Boots & Jerseys"
            link="/shop?category=Football"
            imageUrl="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            title="Cricket"
            subtitle="Bats & Pads"
            link="/shop?category=Cricket"
            imageUrl="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            title="Basketball"
            subtitle="Shoes & Equipment"
            link="/shop?category=Basketball"
            imageUrl="https://images.unsplash.com/photo-1543508282-6319a3e2621d?w=600&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            title="Tennis & Badminton"
            subtitle="Rackets & Gear"
            link="/shop?category=Tennis"
            imageUrl="https://images.unsplash.com/photo-1622279457486-62dcc4a4db13?w=600&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            title="Running"
            subtitle="Ultraboost & Clothing"
            link="/shop?category=Running"
            imageUrl="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            title="Gym & Training"
            subtitle="Bags & Accessories"
            link="/shop?category=Gym"
            imageUrl="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60"
          />
        </div>
      </div>

      {/* Football Section */}
      <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">⚽ Football</h2>
          <Link to="/shop?category=Football" className="text-sm font-black uppercase underline hover:no-underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-10">
          {footballProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Cricket Section */}
      <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">🏏 Cricket</h2>
          <Link to="/shop?category=Cricket" className="text-sm font-black uppercase underline hover:no-underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-10">
          {cricketProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Mid Banner – Performance */}
      <div className="w-full relative overflow-hidden my-8">
        <img
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&auto=format&fit=crop&q=80"
          alt="Adibas Performance"
          className="w-full h-[400px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            ADIBAS PERFORMANCE
          </h2>
          <p className="text-white text-base font-bold mb-8 max-w-xl opacity-90">
            Push your limits. Engineered for athletes who demand the absolute best.
          </p>
          <Link
            to="/shop?category=Running"
            className="bg-white text-black font-black uppercase tracking-wider py-4 px-10 inline-flex items-center gap-3 hover:bg-gray-100 transition-colors text-sm"
          >
            Explore Collection <span>→</span>
          </Link>
        </div>
      </div>

      {/* Popular Right Now */}
      <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">Popular Right Now</h2>
          <Link to="/shop" className="text-sm font-black uppercase underline hover:no-underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-10">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Newsletter Strip */}
      <div className="bg-black text-white py-16 px-4 text-center mt-8">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-3">
          Join adiClub — It's Free
        </h2>
        <p className="text-gray-400 font-bold mb-8 max-w-lg mx-auto">
          Sign up and get 15% off your first purchase. Earn points, unlock exclusives.
        </p>
        <Link
          to="/register"
          className="bg-white text-black font-black uppercase tracking-wider py-4 px-10 inline-flex items-center gap-3 hover:bg-gray-200 transition-colors text-sm"
        >
          Join Now <span>→</span>
        </Link>
      </div>
    </div>
  );
}
