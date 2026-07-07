import React from 'react';
import { CategoryCard } from '../components/ui/CategoryCard';

export function Categories() {
  const categories = [
    { title: "MEN's SHOES", link: "/shop?category=men-shoes", imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60" },
    { title: "WOMEN's SHOES", link: "/shop?category=women-shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" },
    { title: "ACCESSORIES", link: "/shop?category=accessories", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60" },
    { title: "SPORT", link: "/shop?category=sport", imageUrl: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=500&auto=format&fit=crop&q=60" },
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
