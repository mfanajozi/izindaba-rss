import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white placeholder:text-slate-400 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
