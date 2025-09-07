// src/components/ui/Input.jsx
import React, { forwardRef } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  size = 'md',
  variant = 'default',
  className = '',
  required = false,
  showPasswordToggle = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  // ✅ Déterminer le type réel (pour password toggle)
  const actualType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  // ✅ Tailles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // ✅ Variants avec dark mode complet
  const variants = {
    default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
    filled: 'border-transparent bg-gray-100 dark:bg-gray-700',
    flushed: 'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none'
  };

  // ✅ États avec dark mode
  const stateClasses = {
    normal: 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400',
    error: 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400',
    disabled: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed'
  };

  // ✅ Classes de base
  const baseClasses = [
    'block w-full rounded-lg border',
    'text-gray-900 dark:text-gray-100',
    'placeholder-gray-500 dark:placeholder-gray-400',
    'focus:outline-none focus:ring-1',
    'transition-colors duration-200',
    sizes[size],
    variants[variant],
    error ? stateClasses.error : stateClasses.normal,
    props.disabled && stateClasses.disabled,
    LeftIcon && 'pl-10',
    (RightIcon || showPasswordToggle) && 'pr-10',
    className
  ].filter(Boolean).join(' ');

  // ✅ ID unique pour accessibility
  const inputId = React.useId();
  const finalId = props.id || inputId;

  return (
    <div className="w-full">
      {/* ✅ Label avec indicateur required */}
      {label && (
        <label 
          htmlFor={finalId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}

      {/* ✅ Container pour les icônes */}
      <div className="relative">
        {/* Icône gauche */}
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {/* Input principal */}
        <input
          ref={ref}
          id={finalId}
          type={actualType}
          className={baseClasses}
          {...props}
        />

        {/* Icône droite ou toggle password */}
        {(RightIcon || showPasswordToggle) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            ) : RightIcon ? (
              <RightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* ✅ Messages d'erreur et d'aide */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ✅ Composant Textarea séparé
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 3,
  resize = 'vertical', // none, vertical, horizontal, both
  className = '',
  required = false,
  ...props
}, ref) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  const baseClasses = [
    'block w-full rounded-lg border px-3 py-2',
    'border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-700',
    'text-gray-900 dark:text-gray-100',
    'placeholder-gray-500 dark:placeholder-gray-400',
    'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
    'dark:focus:ring-blue-400 dark:focus:border-blue-400',
    'transition-colors duration-200',
    resizeClasses[resize],
    error && 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500',
    props.disabled && 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');

  const textareaId = React.useId();
  const finalId = props.id || textareaId;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={finalId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={finalId}
        rows={rows}
        className={baseClasses}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// ✅ Composant Select
export const Select = forwardRef(({
  label,
  error,
  helperText,
  children,
  placeholder,
  className = '',
  required = false,
  ...props
}, ref) => {
  const baseClasses = [
    'block w-full rounded-lg border px-3 py-2',
    'border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-700',
    'text-gray-900 dark:text-gray-100',
    'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
    'dark:focus:ring-blue-400 dark:focus:border-blue-400',
    'transition-colors duration-200',
    error && 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500',
    props.disabled && 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');

  const selectId = React.useId();
  const finalId = props.id || selectId;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={finalId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}

      <select
        ref={ref}
        id={finalId}
        className={baseClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;