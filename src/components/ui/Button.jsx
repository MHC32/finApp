// src/components/ui/Button.jsx
import React from 'react';
import { LoaderIcon } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  type = 'button',
  onClick,
  ...props 
}) => {
  
  // ✅ Variants avec support dark mode complet
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-transparent dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-900 border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600 dark:focus:ring-gray-400',
    outline: 'bg-transparent hover:bg-gray-50 focus:ring-blue-500 text-gray-700 border-gray-300 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-400',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-transparent dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-400',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white border-transparent dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-400',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-600 border-transparent dark:hover:bg-gray-800 dark:text-gray-400 dark:focus:ring-gray-400'
  };

  // ✅ Tailles
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // ✅ Classes de base avec dark mode
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg border',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-all duration-200',
    'dark:focus:ring-offset-gray-900', // Offset pour dark mode
    sizes[size],
    variants[variant]
  ];

  // ✅ États disabled et loading
  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    loading: 'cursor-wait'
  };

  // ✅ Classes finales
  const finalClasses = [
    ...baseClasses,
    disabled && stateClasses.disabled,
    loading && stateClasses.loading,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={finalClasses}
      {...props}
    >
      {loading && (
        <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;