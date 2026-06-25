import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const variants: Record<string, string> = {
    primary: 'bg-[#72DB73] hover:bg-[#5bbc5c] text-white shadow-lg shadow-green-900/30',
    ghost:   'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    danger:  'bg-[#FF4ADE] hover:bg-[#e033c5] text-white shadow-lg shadow-pink-900/30',
  };

  const sizes: Record<string, string> = {
    sm: 'text-sm px-5 py-2',
    md: 'text-base px-8 py-3',
    lg: 'text-xl px-10 py-4 tracking-widest',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
