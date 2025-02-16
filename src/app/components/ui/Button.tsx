'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { rules } from '@/lib/styles';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  isLoading?: boolean;
  iconOnly?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  iconOnly = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-[var(--accent-light)] dark:bg-[var(--accent-dark)] text-white rounded-full px-6 py-2 transition-all hover:bg-[var(--accent-light)]/90 dark:hover:bg-[var(--accent-dark)]/90',
    secondary: 'border border-[var(--accent-light)] dark:border-[var(--accent-dark)] text-[var(--accent-light)] dark:text-[var(--accent-dark)] rounded-full px-6 py-2 transition-all hover:bg-[var(--accent-light)] dark:hover:bg-[var(--accent-dark)] hover:text-white',
    danger: 'bg-red-500 text-white rounded-full px-6 py-2 transition-all hover:bg-red-600'
  };

  const sizeStyles = {
    sm: iconOnly ? '!p-2' : '!py-1.5 !px-4 text-sm',
    md: iconOnly ? '!p-3' : '!py-2 !px-6 text-base',
    lg: iconOnly ? '!p-4' : '!py-2.5 !px-8 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {!iconOnly && "Processing..."}
        </>
      ) : (
        <>
          {icon && <span className="w-4 h-4">{icon}</span>}
          {!iconOnly && children}
        </>
      )}
    </motion.button>
  );
} 