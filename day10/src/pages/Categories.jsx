import React from 'react';
import { CategoryCard } from '../components/ui/CategoryCard';

export function Categories() {
  const categories = [
    { title: "FOOTBALL", link: "/shop?category=Football", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60" },
    { title: "CRICKET", link: "/shop?category=Cricket", imageUrl: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=500&auto=format&fit=crop&q=60" },
    { title: "BASKETBALL", link: "/shop?category=Basketball", imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621d?w=500&auto=format&fit=crop&q=60" },
    { title: "TENNIS & BADMINTON", link: "/shop?category=Tennis", imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a4db13?w=500&auto=format&fit=crop&q=60" },
    { title: "RUNNING", link: "/shop?category=Running", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60" },
    { title: "GYM & TRAINING", link: "/shop?category=Gym", imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight italic mb-12 text-center">
        Shop By Category
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard key={i} {...cat} />
        ))}
      </div>
    </div>
  );
}
