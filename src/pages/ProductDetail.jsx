import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShoppingBag, Star, Share2, Heart, ArrowLeft, MessageSquare, Shield, Truck, RotateCcw, Box } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useCartStore from '../store/useCartStore';

const ProductDetail = () => {
    const { slug } = useParams();
    const addItem = useCartStore(state => state.addItem);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Mock Model data with multiple Color Variants
    const productModel = {
        id: 1,
        name: 'THUNDER 4 SV',
        brand: 'MT HELMETS',
        rating: '4.8',
        reviews: 215,
        description: 'The Thunder 4 SV represents the latest evolution in safety and design. Featuring a high-strength polycarbonate shell, drop-down sun visor, and improved aerodynamics for high-speed stability.',
        features: ['ECE 22.06 Certified', 'Internal Sun Visor', 'Max Vision Pinlock Compatible', 'Multiple Ventilation Ports', 'Emergency Release Cheek Pads'],
        variants: [
            { 
                id: 101, 
                color: 'MATTE BLACK', 
                price: 12499, 
                compare_price: 14999, 
                stock: 12, 
                hex: '#111111',
                images: [
                    'https://images.unsplash.com/photo-1621259182978-fbf93132d54d?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1542362567-b055002db2ed?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1613933549102-882b54488497?q=80&w=1000&auto=format&fit=crop',
                ]
            },
            { 
                id: 102, 
                color: 'GLOSSY RED', 
                price: 12999, 
                compare_price: 15499, 
                stock: 5, 
                hex: '#e21d1d',
                images: [
                    'https://images.unsplash.com/photo-1613933549102-882b54488497?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1000&auto=format&fit=crop',
                ]
            },
            { 
                id: 103, 
                color: 'CARBON TITANIUM', 
                price: 14499, 
                compare_price: 16999, 
                stock: 0, 
                hex: '#333333',
                images: [
                    'https://images.unsplash.com/photo-1542362567-b055002db2ed?q=80&w=1000&auto=format&fit=crop',
                ]
            },
        ]
    };

    const [selectedVariant, setSelectedVariant] = useState(productModel.variants[0]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setIsLoading(false), 500);
        window.scrollTo(0, 0);
    }, [slug]);

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        setActiveImage(0); // Reset image view to first for new variant
    };

    const handleBuyNow = () => {
        const itemToBuy = {
            ...productModel,
            ...selectedVariant,
            name: `${productModel.brand} ${productModel.name} - ${selectedVariant.color}`
        };
        addItem(itemToBuy);
        window.location.href = '/checkout';
    };

    const handleAddToCart = () => {
        const itemToAdd = {
            ...productModel,
            ...selectedVariant,
            name: `${productModel.brand} ${productModel.name} - ${selectedVariant.color}`
        };
        addItem(itemToAdd);
    };

    if (isLoading) {
        return <div className="h-screen w-full bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-secondary border-t-transparent animate-spin rounded-full" /></div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-black pb-28 md:pb-0">
            <Navbar />
            
            <main className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40 max-w-7xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mb-8 md:mb-12 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <NavLink to="/" className="hover:text-white transition-colors">HOME</NavLink>
                    <span className="opacity-30">/</span>
                    <NavLink to="/shop" className="hover:text-white transition-colors">SHOP ALL</NavLink>
                    <span className="opacity-30">/</span>
                    <span className="text-white/80">{productModel.brand} {productModel.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Images */}
                    <div className="flex flex-col gap-6">
                        <motion.div 
                            key={selectedVariant.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square w-full rounded-3xl overflow-hidden glass border border-white/5 relative group"
                        >
                            <img 
                                src={selectedVariant.images[activeImage]} 
                                alt={productModel.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-6 right-6 flex flex-col gap-3">
                                <button className="p-3 rounded-full glass border-white/10 text-white/50 hover:text-red-500 transition-colors active:scale-90 shadow-xl">
                                    <Heart size={20} />
                                </button>
                                <button className="p-3 rounded-full glass border-white/10 text-white/50 hover:text-white transition-colors active:scale-90 shadow-xl">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            {selectedVariant.images.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setActiveImage(i)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === i ? 'border-secondary' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Badge variant="primary" size="md">{productModel.brand}</Badge>
                                <div className="flex items-center gap-1.5 ml-auto bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <Star size={14} className="fill-primary text-primary" />
                                    <span className="text-xs font-black text-white italic">{productModel.rating}</span>
                                    <span className="text-xs font-bold text-white/30 ml-1">({productModel.reviews} Reviews)</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                                {productModel.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black tracking-[0.2em] uppercase italic ${selectedVariant.stock > 0 ? 'text-secondary' : 'text-red-500'}`}>
                                    {selectedVariant.stock > 0 ? `IN STOCK (${selectedVariant.stock} AVAILABLE)` : 'OUT OF STOCK'}
                                </span>
                            </div>
                            
                            <div className="flex items-baseline gap-4 mt-2">
                                <motion.span 
                                    key={selectedVariant.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-4xl font-black text-secondary italic tracking-tight"
                                >
                                    ₹{selectedVariant.price.toLocaleString()}
                                </motion.span>
                                <span className="text-xl font-bold text-white/20 line-through tracking-wider">₹{selectedVariant.compare_price.toLocaleString()}</span>
                                <Badge variant="secondary" size="lg" className="ml-2">SAVE {Math.round(100 - (selectedVariant.price/selectedVariant.compare_price * 100))}%</Badge>
                            </div>
                        </div>

                        {/* Color Variants (Amazon Style) */}
                        <div className="flex flex-col gap-4 p-6 glass rounded-2xl border-white/5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Select Color Scheme</h4>
                            <div className="flex flex-wrap gap-4">
                                {productModel.variants.map((v) => (
                                    <button 
                                        key={v.id}
                                        onClick={() => handleVariantChange(v)}
                                        className={`group relative flex flex-col items-center gap-3 p-1 transition-all ${selectedVariant.id === v.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                    >
                                        <div 
                                            className={`w-12 h-12 rounded-full border-2 p-1 transition-all ${selectedVariant.id === v.id ? 'border-secondary' : 'border-white/10 group-hover:border-white/40'}`}
                                        >
                                            <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: v.hex }} />
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-tighter transition-all ${selectedVariant.id === v.id ? 'text-white' : 'text-white/40'}`}>
                                            {v.color.split(' ')[0]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full" />

                        <div className="flex flex-col gap-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Specifications & Description</h4>
                            <p className="text-sm font-medium text-white/60 leading-relaxed uppercase tracking-tighter">
                                {productModel.description}
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-2">
                                {productModel.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button 
                                    variant="primary" 
                                    size="lg" 
                                    disabled={selectedVariant.stock === 0}
                                    className="h-16 rounded-2xl flex gap-3 text-sm italic font-black shadow-2xl disabled:opacity-50"
                                    onClick={handleBuyNow}
                                >
                                    {selectedVariant.stock > 0 ? 'BUY IT NOW' : 'NOTIFY ME'}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    disabled={selectedVariant.stock === 0}
                                    className="h-16 rounded-2xl flex gap-3 text-sm bg-white/5 border-white/10 hover:bg-white/10 font-black italic disabled:opacity-50"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag size={20} /> ADD TO CART
                                </Button>
                            </div>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                className="h-16 rounded-2xl flex gap-3 text-sm border-white/10 hover:border-secondary group font-black italic"
                                onClick={() => window.open('tel:07860844044')}
                            >
                                <Phone size={20} className="group-hover:text-secondary group-hover:animate-shake" /> CALL FOR ENQUIRY
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border-white/5 text-center">
                                <Shield size={20} className="text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 leading-tight">100% Genuine<br/>Products</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border-white/5 text-center">
                                <Truck size={20} className="text-secondary" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 leading-tight">Fast pan india<br/>shipping</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border-white/5 text-center">
                                <RotateCcw size={20} className="text-white" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 leading-tight">Easy 7 Days<br/>Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default ProductDetail;
