import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-32 px-4 text-center min-h-[70vh]">
      <p className="text-8xl mb-4">👟</p>
      <h1 className="text-[10rem] font-black leading-none tracking-tighter text-gray-100 select-none">
        404
      </h1>
      <h2 className="text-3xl font-black uppercase tracking-tight -mt-8 mb-4">Page Not Found</h2>
      <p className="font-medium text-gray-500 mb-10 max-w-md">
        Looks like this page ran faster than our athletes. The URL you entered doesn't exist.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/"><Button>Back to Home</Button></Link>
        <Link to="/shop"><Button variant="white">Browse Shop</Button></Link>
      </div>
    </div>
  );
}
