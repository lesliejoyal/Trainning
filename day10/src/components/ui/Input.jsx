import React, { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      className={`flex h-12 w-full bg-white px-0 py-2 text-base font-medium text-black
        border-b-2 border-gray-300 placeholder:text-gray-400
        focus:outline-none focus:border-black transition-colors
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      ref={ref}
       sas {...props}
    />
  );
});

Input.displayName = 'Input';
