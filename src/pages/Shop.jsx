import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, ChevronDown, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';

const Shop = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    // State
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [priceRange, setPriceRange] = useState(15000);
    const [sortBy, setSortBy] = useState('Newest');

    // Mock data - would be replaced by Supabase call
    const allProducts = [
        { id: 1, name: 'LS2 Thunder Carbon', slug: 'ls2-thunder-carbon', price: 3999, compare_price: 4999, image_url: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1000&auto=format&fit=crop', brand: 'LS2', category: 'Helmets', rating: '4.9', stock: 10 },
        { id: 2, name: 'SMK Stellar Edge', slug: 'smk-stellar-edge', price: 3999, compare_price: 4500, image_url: 'https://images.unsplash.com/photo-1542362567-b055002db2ed?q=80&w=1000&auto=format&fit=crop', brand: 'SMK', category: 'Helmets', rating: '4.8', stock: 5 },
        { id: 3, name: 'Vega Crux Gloss', slug: 'vega-crux-gloss', price: 1800, compare_price: 2200, image_url: 'https://images.unsplash.com/photo-1599313289053-1574cc8295ee?q=80&w=1000&auto=format&fit=crop', brand: 'Vega', category: 'Helmets', rating: '4.7', stock: 0 },
        { id: 4, name: 'MT Revenge 2 Ninja', slug: 'mt-revenge-2-ninja', price: 7500, compare_price: 8500, image_url: 'https://images.unsplash.com/photo-1613933549102-882b54488497?q=80&w=1000&auto=format&fit=crop', brand: 'MT', category: 'Helmets', rating: '4.9', stock: 20 },
        { id: 5, name: 'Rynox Stealth Air', slug: 'rynox-stealth-air', price: 6500, compare_price: 7200, image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop', brand: 'Rynox', category: 'Jackets', rating: '4.8', stock: 15 },
        { id: 6, name: 'TVS Racing Gloves', slug: 'tvs-racing-gloves', price: 2900, compare_price: 3500, image_url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=1000&auto=format&fit=crop', brand: 'TVS', category: 'Gloves', rating: '4.6', stock: 20 },
        { id: 7, name: 'TCX RT-Race Boots', slug: 'tcx-rt-race-boots', price: 12500, compare_price: 15000, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', brand: 'TCX', category: 'Boots', rating: '4.9', stock: 8 },
        { id: 8, name: 'Steelbird SBA-7', slug: 'steelbird-sba-7', price: 2500, compare_price: 3000, image_url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop', brand: 'Steelbird', category: 'Helmets', rating: '4.5', stock: 0 },
    ];

    const categories = ['All', 'Helmets', 'Jackets', 'Gloves', 'Boots', 'Pants', 'Accessories'];
    const brands = ['All', 'LS2', 'SMK', 'Vega', 'MT', 'Rynox', 'Steelbird', 'TVS', 'TCX'];

    useEffect(() => {
        // Simulate API loading
        setIsLoading(true);
        setTimeout(() => {
            setProducts(allProducts);
            setIsLoading(false);
        }, 800);
    }, []);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.brand.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
            const matchesPrice = p.price <= priceRange;
            return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
        }).sort((a, b) => {
            if (sortBy === 'Price: Low to High') return a.price - b.price;
            if (sortBy === 'Price: High to Low') return b.price - a.price;
            if (sortBy === 'Rating') return parseFloat(b.rating) - parseFloat(a.rating);
            return b.id - a.id; // Newest
        });
    }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

    return (
        <div className="flex flex-col min-h-screen bg-black pb-28 md:pb-12">
            <Navbar />
            
            <main className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40">
                {/* Shop Header */}
                <div className="flex flex-col mb-12 lg:mb-20">
                    <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                        <NavLink to="/" className="hover:text-white transition-colors">HOME</NavLink>
                        <span className="opacity-30">/</span>
                        <span className="text-white/80 uppercase">EXPLORE CATALOG</span>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-tighter text-white uppercase leading-[0.85] mb-4">
                                PRO <span className="text-secondary">SYSTEMS</span>
                            </h1>
                            <p className="text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-[0.3em] text-white/30 italic max-w-xl">
                                DISCOVER 2,000+ HIGH-PERFORMANCE PROTECTION SYSTEMS TAILORED FOR THE MODERN RIDER.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 lg:mb-2">
                            <div className="relative group flex-grow md:w-72 lg:w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary mb-0.5 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="SEARCH MODELS..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 md:h-16 pl-14 pr-6 text-xs font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all"
                                />
                            </div>
                            <button 
                                onClick={() => setIsFilterOpen(true)}
                                className="h-14 w-14 md:h-16 md:w-16 rounded-2xl glass border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-secondary transition-all active:scale-95"
                            >
                                <SlidersHorizontal size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:flex lg:flex-col gap-10 w-72 flex-shrink-0 sticky top-32 h-fit">
                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-black italic uppercase tracking-widest text-primary border-b border-white/5 pb-2">CATEGORIES</h3>
                            <div className="flex flex-col gap-3">
                                {categories.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-2 ${selectedCategory === cat ? 'text-secondary translate-x-2' : 'text-white/40 hover:text-white/80'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-black italic uppercase tracking-widest text-primary border-b border-white/5 pb-2">BRANDS</h3>
                            <div className="flex flex-col gap-3 h-64 overflow-y-auto pr-4 no-scrollbar custom-scroll">
                                {brands.map(brand => (
                                    <button 
                                        key={brand} 
                                        onClick={() => setSelectedBrand(brand)}
                                        className={`text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-2 ${selectedBrand === brand ? 'text-secondary translate-x-2' : 'text-white/40 hover:text-white/80'}`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <h3 className="text-sm font-black italic uppercase tracking-widest text-primary">PRICE RANGE</h3>
                                <span className="text-[10px] font-black text-white italic">₹{priceRange.toLocaleString()}</span>
                            </div>
                            <input 
                                type="range" min="500" max="25000" step="500"
                                value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full accent-secondary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] font-black text-white/30 tracking-widest uppercase">
                                <span>₹500</span>
                                <span>₹25000+</span>
                            </div>
                        </div>
                    </aside>

                    {/* Products Content */}
                    <div className="flex-grow">
                        {/* Mobile Category Bar */}
                        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar mb-8 pb-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${selectedCategory === cat ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20' : 'bg-transparent border-white/5 text-white/40'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                                SHOWING <span className="text-white">{filteredProducts.length}</span> MODELS
                            </span>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] hidden sm:block">SORT BY</span>
                                    <div className="relative group">
                                        <select 
                                            value={sortBy} 
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white italic focus:outline-none cursor-pointer appearance-none pr-8"
                                        >
                                            <option className="bg-black">Newest</option>
                                            <option className="bg-black">Price: Low to High</option>
                                            <option className="bg-black">Price: High to Low</option>
                                            <option className="bg-black">Rating</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProductGrid products={filteredProducts} isLoading={isLoading} itemsPerPage={12} />
                        
                        {/* Pagination / Load More */}
                        {!isLoading && filteredProducts.length > 0 && filteredProducts.length < 2000 && (
                             <div className="flex flex-col items-center justify-center pt-24 pb-12">
                                <div className="h-px w-24 bg-white/10 mb-8" />
                                <Button variant="outline" className="h-16 px-12 rounded-2xl group border-white/5 hover:border-secondary">
                                    LOAD MORE MODELS <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <p className="mt-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">
                                    REACHING PEAK PERFORMANCE
                                </p>
                             </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-[100] glass flex flex-col pt-24 p-8 lg:hidden"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">FILTER <span className="text-secondary">GEAR</span></h2>
                            <button onClick={() => setIsFilterOpen(false)} className="w-12 h-12 rounded-full glass flex items-center justify-center text-white"><X size={24} /></button>
                        </div>
                        
                        <div className="flex-grow flex flex-col gap-12 overflow-y-auto no-scrollbar pb-20">
                            {/* Mobile Filters Content - Re-using logic or unique UI */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xs font-black uppercase text-primary italic">BRANDS</h3>
                                <div className="flex flex-wrap gap-2">
                                    {brands.map(brand => (
                                        <button 
                                            key={brand} 
                                            onClick={() => setSelectedBrand(brand)}
                                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${selectedBrand === brand ? 'bg-secondary border-secondary text-white' : 'border-white/10 text-white/40'}`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-xs font-black uppercase text-primary italic">PRICE LIMIT</h3>
                                    <span className="text-xs font-black text-white italic">₹{priceRange.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" min="500" max="25000" step="500"
                                    value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full accent-secondary h-2 bg-white/5 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                        
                        <div className="absolute bottom-10 left-8 right-8">
                            <Button size="lg" className="w-full h-16 rounded-2xl italic font-black shadow-2xl" onClick={() => setIsFilterOpen(false)}>
                                APPLY FILTERS & SHOW MODELS
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
};

export default Shop;
