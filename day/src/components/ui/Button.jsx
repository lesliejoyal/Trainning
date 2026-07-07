import React from 'react';

export function Button({
  children,
  variant = 'black',
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  ...props
}) {
  const base = 'font-black uppercase tracking-wider py-4 px-8 inline-flex items-center justify-between gap-4 border-2 transition-all duration-200 cursor-pointer min-w-[180px] text-sm disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    black: 'bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800',
    white: 'bg-white text-black border-black hover:bg-gray-100',
    outline: 'bg-transparent text-black border-black hover:bg-black hover:text-white',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.black} ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span className="font-bold">→</span>
    </button>
  );
}
