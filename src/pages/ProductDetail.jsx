import React, { useState, useEffect, useCallback } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ShoppingBag, Star, Share2, Heart, Shield, Truck, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useCartStore from '../store/useCartStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const addItem = useCartStore(state => state.addItem);

    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [error, setError] = useState(null);

    const fetchProduct = useCallback(async (targetSlug) => {
        if (!targetSlug || targetSlug === 'null' || targetSlug === 'undefined') {
            setError('Invalid Product ID');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await axios.get(`${API_URL}/products/${targetSlug}`);

            if (res.data.success) {
                const data = res.data.product;
                setProduct(data);
                const matchedVariant = data.product_variants?.find(v => v.slug === targetSlug);
                setSelectedVariant(matchedVariant || data.product_variants?.[0] || null);
            }
        } catch (err) {
            console.error('Failed to load product', err);
            setError('Product not found or connection error');
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchProduct(slug);
        window.scrollTo(0, 0);
    }, [slug, fetchProduct]);

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        setActiveImage(0);
        window.history.replaceState({}, '', `/product/${variant.slug}`);
    };

    const handleBuyNow = () => {
        if (!selectedVariant) return;
        addItem({
            ...product,
            ...selectedVariant,
            name: `${product.brand} ${product.name} - ${selectedVariant.color}`,
        });
        navigate('/checkout');
    };

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addItem({
            ...product,
            ...selectedVariant,
            name: `${product.brand} ${product.name} - ${selectedVariant.color}`,
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-black pb-28 md:pb-0">
                <Navbar />
                <main className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                        <div className="aspect-square w-full rounded-3xl bg-white/5 animate-pulse" />
                        <div className="flex flex-col gap-6">
                            <div className="h-8 w-32 rounded-full bg-white/5 animate-pulse" />
                            <div className="h-16 w-3/4 rounded-xl bg-white/5 animate-pulse" />
                            <div className="h-10 w-1/3 rounded-xl bg-white/5 animate-pulse" />
                            <div className="h-32 w-full rounded-2xl bg-white/5 animate-pulse" />
                            <div className="h-16 w-full rounded-2xl bg-white/5 animate-pulse" />
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-6">
                <Navbar />
                <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">PRODUCT NOT FOUND</h1>
                <Button onClick={() => navigate('/shop')}>GO BACK TO SHOP</Button>
                <BottomNav />
            </div>
        );
    }

    const images = Array.isArray(selectedVariant?.image_urls) && selectedVariant.image_urls.length > 0
        ? selectedVariant.image_urls
        : [product.image_url || 'https://via.placeholder.com/1000?text=NO+IMAGE'];

    return (
        <div className="flex flex-col min-h-screen bg-black pb-28 md:pb-0">
            <Helmet>
                <title>{`${product.brand} ${product.name} | Amstel Riders`}</title>
                <meta name="description" content={product.description?.substring(0, 160) || `Buy ${product.brand} ${product.name} at Amstel Riders. Premium motorcycle gear with fast delivery.`} />
            </Helmet>
            <Navbar />
            <main className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40 max-w-7xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mb-8 md:mb-12 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <NavLink to="/" className="hover:text-white transition-colors">HOME</NavLink>
                    <span className="opacity-30">/</span>
                    <NavLink to="/shop" className="hover:text-white transition-colors">SHOP ALL</NavLink>
                    <span className="opacity-30">/</span>
                    <span className="text-white/80">{product.brand} {product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Images */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            key={selectedVariant?.id || 'main-img'}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square w-full rounded-3xl overflow-hidden glass border border-white/5 relative group"
                        >
                            <img
                                src={images[activeImage]}
                                alt={product.name}
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

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === i ? 'border-secondary' : 'border-white/5 hover:border-white/20'}`}
                                    >
                                        <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Badge variant="primary" size="md">{product.brand}</Badge>
                                <div className="flex items-center gap-1.5 ml-auto bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <Star size={14} className="fill-primary text-primary" />
                                    <span className="text-xs font-black text-white italic">{product.rating || '4.8'}</span>
                                    <span className="text-xs font-bold text-white/30 ml-1">({product.reviews || 100}+ Reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black tracking-[0.2em] uppercase italic ${selectedVariant?.stock > 0 ? 'text-secondary' : 'text-red-500'}`}>
                                    {selectedVariant?.stock > 0 ? `IN STOCK (${selectedVariant.stock} AVAILABLE)` : 'OUT OF STOCK'}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-4 mt-2">
                                <motion.span key={selectedVariant?.id || 'price'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-black text-secondary italic tracking-tight">
                                    ₹{selectedVariant?.price ? selectedVariant.price.toLocaleString() : (product.price || 0).toLocaleString()}
                                </motion.span>
                                {selectedVariant?.compare_price && (
                                    <>
                                        <span className="text-xl font-bold text-white/20 line-through tracking-wider">₹{selectedVariant.compare_price.toLocaleString()}</span>
                                        <Badge variant="secondary" size="lg" className="ml-2">SAVE {Math.round(100 - (selectedVariant.price / selectedVariant.compare_price * 100))}%</Badge>
                                    </>
                                )}
                            </div>
                        </div>

                        {product.product_variants?.length > 0 && (
                            <div className="flex flex-col gap-4 p-6 glass rounded-2xl border-white/5">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Select Color Scheme</h4>
                                <div className="flex flex-wrap gap-4">
                                    {product.product_variants.map((v) => (
                                        <button key={v.id} onClick={() => handleVariantChange(v)}
                                            className={`group relative flex flex-col items-center gap-3 p-1 transition-all ${selectedVariant?.id === v.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                                            <div className={`w-12 h-12 rounded-full border-2 p-1 transition-all ${selectedVariant?.id === v.id ? 'border-secondary' : 'border-white/10 group-hover:border-white/40'}`}>
                                                <div className="w-full h-full rounded-full shadow-inner overflow-hidden flex items-center justify-center bg-white/10">
                                                    {v.image_urls?.[0] ? <img src={v.image_urls[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-800" />}
                                                </div>
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-tighter transition-all ${selectedVariant?.id === v.id ? 'text-white' : 'text-white/40'}`}>
                                                {v.color.split(' ')[0]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-white/10 w-full" />

                        <div className="flex flex-col gap-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Specifications & Description</h4>
                            <div className="text-sm font-medium text-white/60 leading-relaxed uppercase tracking-tighter whitespace-pre-wrap">
                                {product.description || 'DYNAMIC PROTECTION SYSTEM DESIGNED FOR EXTREME PERFORMANCE.'}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button variant="primary" size="lg" disabled={!selectedVariant || selectedVariant.stock === 0}
                                    className="h-16 rounded-2xl flex gap-3 text-sm italic font-black shadow-2xl disabled:opacity-50" onClick={handleBuyNow}>
                                    {selectedVariant?.stock > 0 ? 'BUY IT NOW' : 'OUT OF STOCK'}
                                </Button>
                                <Button variant="outline" size="lg" disabled={!selectedVariant || selectedVariant.stock === 0}
                                    className="h-16 rounded-2xl flex gap-3 text-sm bg-white/5 border-white/10 hover:bg-white/10 font-black italic disabled:opacity-50" onClick={handleAddToCart}>
                                    <ShoppingBag size={20} /> ADD TO CART
                                </Button>
                            </div>
                            <Button variant="outline" size="lg" className="h-16 rounded-2xl flex gap-3 text-sm border-white/10 hover:border-secondary group font-black italic"
                                onClick={() => window.open('tel:07868844044')}>
                                <Phone size={20} className="group-hover:text-secondary group-hover:animate-shake" /> CALL FOR ENQUIRY
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border-white/5 text-center">
                                <Shield size={20} className="text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 leading-tight">100% Genuine<br />Products</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border-white/5 text-center">
                                <Truck size={20} className="text-secondary" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 leading-tight">Fast pan india<br />shipping</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 glass rounded-2xl border-white/5 text-center">
                                <RotateCcw size={20} className="text-white" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/50 leading-tight">Within 7 Days<br />Delivery</span>
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