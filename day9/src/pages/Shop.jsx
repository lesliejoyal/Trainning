import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProductCard } from '../components/ui/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

export function Shop() {
  const [searchParams] = useSearchParams();
  const products = useSelector((state) => state.products.items);
  
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const saleParam = searchParams.get('sale');

  const [sortOption, setSortOption] = useState('newest');

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryParam) {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(categoryParam.toLowerCase()));
    }
    
    if (searchParam) {
      const q = searchParam.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (saleParam) {
      filtered = filtered.filter(p => p.tag === 'SALE');
    }

    switch (sortOption) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Assume lower ID or 'NEW' tag is newer, just reversing for dummy effect
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [products, categoryParam, searchParam, saleParam, sortOption]);

  const title = searchParam 
    ? `SEARCH RESULTS FOR "${searchParam}"` 
    : saleParam 
      ? 'END OF SEASON SALE (EOSS)'
      : categoryParam 
        ? `${categoryParam.toUpperCase()}`
        : 'ALL PRODUCTS';

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <nav className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:underline hover:text-black">Home</Link> / 
            <span className="text-black ml-1">Shop</span>
          </nav>
          <h1 className="text-4xl font-black uppercase tracking-tight italic">
            {title}
          </h1>
          <p className="text-sm font-bold mt-2">[{filteredProducts.length} results]</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-black px-4 py-2 text-sm font-bold uppercase outline-none focus:ring-1 focus:ring-black cursor-pointer bg-white"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price (Low - High)</option>
            <option value="price_high">Price (High - Low)</option>
          </select>
          <button className="flex items-center border border-black px-4 py-2 text-sm font-bold uppercase hover:bg-gray-100 transition-colors">
            Filter
            <SlidersHorizontal className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard {...product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-black uppercase mb-2">No results found</h2>
          <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
