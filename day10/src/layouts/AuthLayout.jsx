import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdibasLogo = () => (
  <svg width="80" height="55" viewBox="0 0 100 65" fill="black" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6 62.3L2.2 40.5L16.8 32.2L29.2 54L14.6 62.3Z" />
    <path d="M38.8 62.3L16.2 22.5L30.8 14.2L53.4 54L38.8 62.3Z" />
    <path d="M63.1 62.3L30.1 4.5L44.7 -3.8147e-06L77.7 54L63.1 62.3Z" />
  </svg>
);

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-12">
          <Link to="/" className="flex items-end">
            <AdibasLogo />
          </Link>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>  
  );
}
