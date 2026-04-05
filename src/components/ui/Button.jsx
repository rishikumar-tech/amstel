import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    ...props 
}) => {
    const variants = {
        primary: 'bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20',
        secondary: 'bg-white text-black hover:bg-white/90',
        outline: 'border border-white/20 text-white hover:bg-white/10',
        ghost: 'text-white hover:bg-white/5',
        gold: 'bg-primary text-black hover:bg-primary/90 font-bold',
        whatsapp: 'bg-[#25D366] text-white hover:bg-[#20ba5a]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        icon: 'p-2',
    };

    return (
        <button
            className={twMerge(
                'inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none btn-hover-effect',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
