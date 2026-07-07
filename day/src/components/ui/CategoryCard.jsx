import React from 'react';
import { Link } from 'react-router-dom';

export function CategoryCard({ title, subtitle, imageUrl, link }) {
  return (
    <Link
      to={link}
      className="group block min-w-[240px] max-w-[320px] flex-shrink-0 relative overflow-hidden snap-start"
    >
      <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&auto=format&fit=crop&q=60"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&auto=format&fit=crop&q=60";
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white text-xl font-black uppercase tracking-tight leading-none">{title}</h3>
        {subtitle && (
          <p className="text-white text-xs font-bold uppercase mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {subtitle} →
          </p>
        )}
      </div>
    </Link>
  );
}
