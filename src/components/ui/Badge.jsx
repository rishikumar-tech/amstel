import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, className, variant = 'info', size = 'sm', ...props }) => {
    const variants = {
        primary: 'bg-primary text-black font-black',
        secondary: 'bg-secondary text-white font-black',
        success: 'bg-[#25D366] text-white font-black',
        danger: 'bg-red-600 text-white font-black',
        info: 'bg-white/10 text-white border border-white/10',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[8px]',
        md: 'px-3 py-1 text-[10px]',
        lg: 'px-4 py-1.5 text-xs',
    };

    return (
        <span
            className={twMerge(
                'inline-flex items-center justify-center rounded-full uppercase tracking-widest font-black',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
