import React from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ className, ...props }) => {
    return (
        <div 
            className={twMerge(
                "animate-pulse bg-white/5 border border-white/5",
                className
            )} 
            {...props} 
        />
    );
};

export default Skeleton;
