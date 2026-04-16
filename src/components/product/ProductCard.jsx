import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import useCartStore from '../../store/useCartStore';

const ProductCard = ({ product }) => {
    const addItem = useCartStore(state => state.addItem);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative flex flex-col glass rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-white/5 to-transparent shadow-xl"
        >
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden">
                <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop';
                    }}
                />
                
                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button 
                        onClick={() => addItem(product)}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300 scale-90 group-hover:scale-100 delay-75"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <NavLink 
                        to={`/product/${product.slug}`}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300 scale-90 group-hover:scale-100 delay-150"
                    >
                        <Eye size={20} />
                    </NavLink>
                </div>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="danger" size="sm">LOW STOCK</Badge>
                    )}
                    {product.stock === 0 && (
                        <Badge variant="info" size="sm">OUT OF STOCK</Badge>
                    )}
                    {product.compare_price > product.price && (
                        <Badge variant="secondary" size="sm">
                            {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                        </Badge>
                    )}
                </div>
                
                <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/50 hover:text-red-500 transition-colors duration-300">
                    <Heart size={18} />
                </button>
            </div>

            {/* Content Container */}
            <div className="p-3 md:p-5 lg:p-6 flex flex-col gap-1.5 md:gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-[7px] md:text-[9px] lg:text-[10px] font-black tracking-widest text-primary uppercase">
                        {product.brand}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                        <Star size={8} className="fill-primary text-primary md:w-[10px]" />
                        <span className="text-[8px] md:text-[10px] font-bold text-white/60">{product.rating || '4.8'}</span>
                    </div>
                </div>
                
                <h3 className="text-[10px] sm:text-[11px] md:text-sm lg:text-base font-black tracking-tighter text-white uppercase line-clamp-1 group-hover:text-secondary transition-colors duration-300">
                    {product.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm md:text-lg lg:text-xl font-black text-white italic">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.compare_price > product.price && (
                        <span className="text-[7px] md:text-[11px] font-bold text-white/30 line-through">
                            ₹{product.compare_price.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Mobile/Tablet Quick Add */}
                <button 
                    className="lg:hidden mt-2 w-full h-9 md:h-11 bg-white/5 border border-white/10 rounded-xl text-[8px] md:text-[10px] font-black italic uppercase text-white hover:bg-secondary hover:border-secondary transition-all active:scale-95 flex items-center justify-center gap-2"
                    onClick={() => addItem(product)}
                >
                    <ShoppingCart size={12} className="md:w-4 md:h-4" /> <span>ADD TO BAG</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
