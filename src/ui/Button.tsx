import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-[#ff6d11] text-white hover:bg-[#E65A00] hover:shadow-xl hover:-translate-y-0.5 shadow-lg shadow-orange-500/25',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 shadow-lg',
    outline: 'bg-white border-2 border-gray-200 text-gray-900 hover:border-[#ff6d11] hover:text-[#ff6d11] hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-xl hover:-translate-y-0.5 shadow-lg shadow-red-500/25',
  };
  
  const sizes = {
    sm: 'px-5 py-2.5 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
