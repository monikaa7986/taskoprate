import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-250 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98]';

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-black hover:shadow-md hover:shadow-slate-900/20 focus:ring-slate-900 border border-transparent shadow-xs',
    secondary: 'bg-stone-100 text-slate-800 hover:bg-stone-200 hover:shadow-xs focus:ring-stone-400 border border-stone-200',
    outline: 'bg-transparent text-slate-900 hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs border border-slate-300 focus:ring-slate-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:shadow-red-600/20 focus:ring-red-500 border border-transparent shadow-xs',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400 border border-transparent',
    accent: 'bg-amber-700 text-white hover:bg-amber-800 hover:shadow-md hover:shadow-amber-700/20 focus:ring-amber-700 border border-transparent shadow-xs'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
