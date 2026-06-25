import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-400 font-medium pl-1">
          {label}
        </label>
      )}
      <input
        id={id}
        autoComplete="off"
        className={`
          w-full bg-[#292929] text-white placeholder-[#7C7C7C]
          px-4 py-4 rounded-lg outline-none transition-all duration-200
          border border-transparent
          focus:border-[#72DB73] focus:ring-1 focus:ring-[#72DB73]/30
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span role="alert" className="text-red-500 text-sm pl-1 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </span>
      )}
    </div>
  );
}
