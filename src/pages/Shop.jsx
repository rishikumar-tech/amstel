import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

// ─── In-memory cache: cacheKey → { data, timestamp } ─────────────────────────
const cache = new Map();
const CACHE_TTL = 60_000; // 60 seconds

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null; }
    return entry.data;
}
function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}
function buildCacheKey(params) {
    return JSON.stringify(params, Object.keys(params).sort());
}

const Shop = () => {
    const location = useLocation();
    const { bikeSlug } = useParams();
    const queryParams = new URLSearchParams(location.search);

    // ─── State ─────────────────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [brands, setBrands] = useState(['All', 'STEELBIRD', 'VEGA', 'STUDDS', 'LS2', 'MT HELMETS', 'ROYAL ENFIELD']);
    const [categories, setCategories] = useState(['All', 'HELMETS', 'JACKETS', 'GLOVES', 'BOOTS', 'PANTS', 'ACCESSORIES']);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'All');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedBike, setSelectedBike] = useState(bikeSlug || '');
    const [priceRange, setPriceRange] = useState(25000);   // live display only
    const [committedPrice, setCommittedPrice] = useState(25000);   // triggers fetch on release
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // ─── Refs ───────────────────────────────────────────────────────────────────
    const abortRef = useRef(null);   // AbortController for in-flight requests
    const searchTimerRef = useRef(null);   // debounce timer
    const filtersLoadedRef = useRef(false);  // run filter fetch exactly once

    // ─── 1. Filter meta-data — parallel, cached, runs once ────────────────────
    useEffect(() => {
        if (filtersLoadedRef.current) return;
        filtersLoadedRef.current = true;

        const cached = getCached('__filters__');
        if (cached) {
            setBikes(cached.bikes);
            setBrands(cached.brands);
            setCategories(cached.categories);
            return;
        }

        Promise.all([
            axios.get(`${API_URL}/bikes`),
            axios.get(`${API_URL}/admin/brands`),
            axios.get(`${API_URL}/admin/categories`),
        ]).then(([bRes, brRes, cRes]) => {
            const b = bRes.data.success ? bRes.data.bikes : [];
            const br = brRes.data.success ? ['All', ...brRes.data.brands.map(x => x.name.toUpperCase())] : brands;
            const c = cRes.data.success ? ['All', ...cRes.data.categories.map(x => x.name.toUpperCase())] : categories;
            setBikes(b); setBrands(br); setCategories(c);
            setCache('__filters__', { bikes: b, brands: br, categories: c });
        }).catch(err => console.error('Filter fetch failed:', err));
    }, []);

    // ─── 2. Sync URL → state (no fetch side-effect) ───────────────────────────
    useEffect(() => {
        if (bikeSlug) setSelectedBike(bikeSlug);
        const q = queryParams.get('q');
        const cat = queryParams.get('category');
        if (q) setSearchQuery(q);
        if (cat) setSelectedCategory(cat);
    }, [bikeSlug, location.search]);

    // ─── 3. Core fetch — cancellable + cache-first ────────────────────────────
    const fetchProducts = useCallback(async (fetchPage, append = false) => {
        // Cancel previous in-flight request immediately
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const params = {
            page: fetchPage,
            limit: 12,
            ...(selectedCategory !== 'All' && { category: selectedCategory }),
            ...(selectedBrand !== 'All' && { brand: selectedBrand }),
            ...(selectedBike && { bike: selectedBike }),
            maxPrice: committedPrice,
            ...(searchQuery && { search: searchQuery }),
            sort: sortBy,
        };

        const key = buildCacheKey(params);
        const cached = getCached(key);

        if (cached) {
            // Instant render — zero network latency
            setProducts(prev => append ? [...prev, ...cached] : cached);
            setHasMore(cached.length === 12);
            setPage(fetchPage);
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
        }

        if (!append) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const res = await axios.get(`${API_URL}/products`, {
                params,
                signal: controller.signal,
            });

            if (res.data.success) {
                const newProducts = res.data.products;
                setCache(key, newProducts);
                setProducts(prev => append ? [...prev, ...newProducts] : newProducts);
                setHasMore(newProducts.length === 12);
                setPage(fetchPage);
            }
        } catch (err) {
            // Silently drop cancelled/stale requests
            if (axios.isCancel(err) || err.name === 'CanceledError') return;
            console.error('Shop Fetch Error:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [selectedCategory, selectedBrand, selectedBike, committedPrice, sortBy, searchQuery]);

    // ─── 4. Trigger fresh fetch on every filter change ────────────────────────
    useEffect(() => {
        clearTimeout(searchTimerRef.current);
        // 350ms debounce for typing; instant for all other filter changes
        searchTimerRef.current = setTimeout(() => {
            fetchProducts(1, false);
        }, searchQuery ? 350 : 0);
        return () => clearTimeout(searchTimerRef.current);
    }, [fetchProducts]);

    // ─── 5. Price slider — show live, only fetch on release ───────────────────
    const handlePriceChange = (e) => setPriceRange(parseInt(e.target.value));
    const handlePriceCommit = (e) => setCommittedPrice(parseInt(e.target.value));

    // ─── 6. Load More ──────────────────────────────────────────────────────────
    const handleLoadMore = () => fetchProducts(page + 1, true);

    // ─── 7. Hover over Load More → prefetch next page silently ────────────────
    const prefetchNextPage = useCallback(() => {
        const params = {
            page: page + 1, limit: 12,
            ...(selectedCategory !== 'All' && { category: selectedCategory }),
            ...(selectedBrand !== 'All' && { brand: selectedBrand }),
            ...(selectedBike && { bike: selectedBike }),
            maxPrice: committedPrice,
            ...(searchQuery && { search: searchQuery }),
            sort: sortBy,
        };
        const key = buildCacheKey(params);
        if (!getCached(key)) {
            axios.get(`${API_URL}/products`, { params })
                .then(r => { if (r.data.success) setCache(key, r.data.products); })
                .catch(() => { });
        }
    }, [page, selectedCategory, selectedBrand, selectedBike, committedPrice, sortBy, searchQuery]);

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
                                {selectedBrand !== 'All' ? selectedBrand : selectedCategory !== 'All' ? selectedCategory : 'PRO'}{' '}
                                <span className="text-secondary">
                                    {selectedBrand !== 'All' && selectedCategory !== 'All' ? selectedCategory : 'SYSTEMS'}
                                </span>
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
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:flex lg:flex-col gap-10 w-72 flex-shrink-0 sticky top-32 h-fit">
                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-black italic uppercase tracking-widest text-primary border-b border-white/5 pb-2">CATEGORIES</h3>
                            <div className="flex flex-col gap-3">
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                                        className={`text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-2 ${selectedCategory === cat ? 'text-secondary translate-x-2' : 'text-white/40 hover:text-white/80'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-black italic uppercase tracking-widest text-primary border-b border-white/5 pb-2">BRANDS</h3>
                            <div className="flex flex-col gap-3 h-48 overflow-y-auto pr-4 no-scrollbar custom-scroll">
                                {brands.map(brand => (
                                    <button key={brand} onClick={() => setSelectedBrand(brand)}
                                        className={`text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-2 ${selectedBrand === brand ? 'text-secondary translate-x-2' : 'text-white/40 hover:text-white/80'}`}>
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="text-sm font-black italic uppercase tracking-widest text-primary border-b border-white/5 pb-2">BIKES</h3>
                            <div className="flex flex-col gap-3 h-48 overflow-y-auto pr-4 no-scrollbar custom-scroll">
                                <button onClick={() => setSelectedBike('')}
                                    className={`text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-2 ${!selectedBike ? 'text-secondary translate-x-2' : 'text-white/40 hover:text-white/80'}`}>
                                    ALL BIKES
                                </button>
                                {bikes.map(bike => (
                                    <button key={bike.id} onClick={() => setSelectedBike(bike.slug)}
                                        className={`text-left text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:translate-x-2 ${selectedBike === bike.slug ? 'text-secondary translate-x-2' : 'text-white/40 hover:text-white/80'}`}>
                                        {bike.name}
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
                                value={priceRange}
                                onChange={handlePriceChange}
                                onMouseUp={handlePriceCommit}
                                onTouchEnd={handlePriceCommit}
                                className="w-full accent-secondary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] font-black text-white/30 tracking-widest uppercase">
                                <span>₹500</span><span>₹25000+</span>
                            </div>
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="flex-grow">
                        {/* Mobile Filter Bars */}
                        <div className="lg:hidden flex flex-col gap-4 mb-8">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                <div className="flex items-center gap-3 pr-2">
                                    <span className="text-[10px] font-black text-white/20 whitespace-nowrap uppercase tracking-widest italic">BRAND</span>
                                    {brands.map(brand => (
                                        <button key={brand} onClick={() => setSelectedBrand(brand)}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${selectedBrand === brand ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20' : 'bg-transparent border-white/5 text-white/40'}`}>
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                <div className="flex items-center gap-3 pr-2">
                                    <span className="text-[10px] font-black text-white/20 whitespace-nowrap uppercase tracking-widest italic">BIKE</span>
                                    <button onClick={() => setSelectedBike('')}
                                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${!selectedBike ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20' : 'bg-transparent border-white/5 text-white/40'}`}>
                                        ALL BIKES
                                    </button>
                                    {bikes.map(bike => (
                                        <button key={bike.id} onClick={() => setSelectedBike(bike.slug)}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${selectedBike === bike.slug ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20' : 'bg-transparent border-white/5 text-white/40'}`}>
                                            {bike.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-3 pr-2">
                                    <span className="text-[10px] font-black text-white/20 whitespace-nowrap uppercase tracking-widest italic">CATEGORY</span>
                                    {categories.map(cat => (
                                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${selectedCategory === cat ? 'bg-secondary border-secondary text-white' : 'bg-transparent border-white/5 text-white/40'}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                                    SHOWING <span className="text-white">{products.length}</span> MODELS
                                </span>
                                {(selectedBrand !== 'All' || selectedCategory !== 'All' || selectedBike !== '') && (
                                    <button
                                        onClick={() => { setSelectedBrand('All'); setSelectedCategory('All'); setSelectedBike(''); }}
                                        className="text-[8px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors border-b border-secondary/30 pb-0.5"
                                    >
                                        CLEAR ALL
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] hidden sm:block">SORT BY</span>
                                    <div className="relative group">
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white italic focus:outline-none cursor-pointer appearance-none pr-8">
                                            <option value="newest" className="bg-black">Newest</option>
                                            <option value="price-low" className="bg-black">Price: Low to High</option>
                                            <option value="price-high" className="bg-black">Price: High to Low</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProductGrid products={products} isLoading={isLoading} itemsPerPage={12} />

                        {/* Load More */}
                        {!isLoading && hasMore && (
                            <div className="flex flex-col items-center justify-center pt-24 pb-12">
                                <div className="h-px w-24 bg-white/10 mb-8" />
                                <Button
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    onMouseEnter={prefetchNextPage}
                                    disabled={isLoadingMore}
                                    className="h-16 px-12 rounded-2xl group border-white/5 hover:border-secondary disabled:opacity-50"
                                >
                                    {isLoadingMore
                                        ? 'LOADING...'
                                        : <> LOAD MORE MODELS <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /> </>
                                    }
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
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-[100] glass flex flex-col pt-24 p-8 lg:hidden"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">FILTER <span className="text-secondary">GEAR</span></h2>
                            <button onClick={() => setIsFilterOpen(false)} className="w-12 h-12 rounded-full glass flex items-center justify-center text-white"><X size={24} /></button>
                        </div>

                        <div className="flex-grow flex flex-col gap-12 overflow-y-auto no-scrollbar pb-20">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xs font-black uppercase text-primary italic">BRANDS</h3>
                                <div className="flex flex-wrap gap-2">
                                    {brands.map(brand => (
                                        <button key={brand} onClick={() => setSelectedBrand(brand)}
                                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${selectedBrand === brand ? 'bg-secondary border-secondary text-white' : 'border-white/10 text-white/40'}`}>
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
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    onMouseUp={handlePriceCommit}
                                    onTouchEnd={handlePriceCommit}
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