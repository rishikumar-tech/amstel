import React from 'react';
import ProductCard from './ProductCard';
import Skeleton from '../common/Skeleton';

const ProductGrid = ({ products, isLoading, itemsPerPage = 12 }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!products?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                    <span className="text-4xl text-white/10 italic">!</span>
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">
                    NO PRODUCTS FOUND
                </h3>
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
                    Try adjusting your filters or search query
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
