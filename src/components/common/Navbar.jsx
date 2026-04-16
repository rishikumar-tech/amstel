import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../store/useCartStore';

const MenuToggle = ({ isOpen, toggle }) => (
    <button
        onClick={toggle}
        className="lg:hidden w-12 h-12 rounded-xl glass border border-white/10 flex flex-col items-center justify-center gap-[6px] text-white/60 hover:text-white transition-all z-[80] relative group overflow-hidden"
    >
        <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-current block origin-center transition-all duration-300 ease-out"
        />
        <motion.span
            animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
            className="w-6 h-[2px] bg-current block transition-all duration-300 ease-out group-hover:w-4"
        />
        <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-current block origin-center transition-all duration-300 ease-out group-hover:w-5"
        />
    </button>
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const cartCount = useCartStore(state => state.items.length);
    const location = useLocation();
    const navigate = useNavigate();

    // Debounced search for real-time results (Optional enhancement)
    useEffect(() => {
        if (searchQuery.trim() && location.pathname === '/shop') {
            const timeoutId = setTimeout(() => {
                navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery, location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Categories', path: '/categories' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3 md:py-4' : 'bg-transparent py-5 md:py-8'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-x-2 md:gap-x-4">
                        {/* Logo Container */}
                        <div className="flex-shrink-0">
                            <img
                                src="/assets/AR LOGO.png"
                                alt="AR LOGO"
                                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
                            />
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-end gap-2">
                                <h1 className="text-xl md:text-3xl lg:text-4xl font-black italic tracking-tighter text-white leading-none">
                                    AMSTEL
                                </h1>

                                <h4 className="text-sm md:text-lg lg:text-xl font-bold tracking-[0.25em] text-yellow-400 leading-none">
                                    RIDERS
                                </h4>
                            </div>
                            <span className="text-[8px] md:text-[10px] lg:text-[12px] font-bold tracking-[0.25em] text-red-500 text-primary uppercase mt-1">
                                HELMETS | RIDING GEAR | BIKE ACCESSORIES
                            </span>
                        </div>
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-12">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `
                                text-[13px] font-black tracking-widest uppercase transition-all duration-300
                                ${isActive ? 'text-secondary translate-y-[-2px]' : 'text-white/60 hover:text-white'}
                            `}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Amazon-style Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
                        <form onSubmit={handleSearch} className="w-full flex">
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="SEARCH GEAR, BRANDS, MODELS..."
                                    className="w-full bg-white/5 border border-white/10 rounded-l-xl h-11 pl-5 pr-4 text-[11px] font-black italic tracking-widest text-white uppercase placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-secondary text-white px-6 rounded-r-xl h-11 flex items-center justify-center hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                            >
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-8">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="lg:hidden text-white/60 hover:text-white transition-all duration-300 transform hover:scale-110"
                        >
                            <Search size={22} className="md:w-6 md:h-6" />
                        </button>
                        <NavLink to="/cart" className="relative group p-1">
                            <ShoppingBag size={22} className="md:w-6 md:h-6 text-white/60 group-hover:text-white transition-all duration-300" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center pulse-red border border-black">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        {/* Mobile Menu Toggle */}
                        <MenuToggle isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
                    </div>
                </div>

                {/* Premium Mobile Menu Drawer */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute top-24 left-4 right-4 sm:left-auto sm:right-12 sm:w-[300px] lg:hidden flex flex-col bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl z-[70] p-6 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-sm font-black italic tracking-widest uppercase text-white/90">MENU</span>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col space-y-6">
                                    {navLinks.map((link, i) => (
                                        <motion.div
                                            key={link.path}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <NavLink
                                                to={link.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={({ isActive }) => `
                                                text-xl font-black uppercase tracking-tighter italic block transition-all
                                                ${isActive ? 'text-secondary scale-105 origin-left' : 'text-white/60 hover:text-white'}
                                            `}
                                            >
                                                {link.name}
                                            </NavLink>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-10 border-t border-white/5">
                                    <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 italic">CONNECT WITH THE SYSTEM</p>
                                    <div className="flex gap-6">
                                        <a href="tel:07868844044" className="text-white/40 hover:text-white transition-colors"><Phone size={20} /></a>
                                        <a href="mailto:amstelriders@gmail.com" className="text-white/40 hover:text-white transition-colors"><Mail size={20} /></a>
                                        <a href="https://wa.me/917868844044" className="text-white/40 hover:text-white transition-colors"><MessageCircle size={20} /></a>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:p-12"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-8 right-8 md:top-12 md:right-12 w-16 h-16 rounded-full glass border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all transform hover:rotate-90"
                        >
                            <X size={32} />
                        </button>

                        <form onSubmit={handleSearch} className="w-full max-w-5xl flex flex-col gap-8 md:gap-12">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white text-center"
                            >
                                QUERY THE <span className="text-secondary underline underline-offset-8">SYSTEM</span>
                            </motion.h2>
                            <div className="relative group">
                                <Search className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-all" size={32} />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="MODEL, BRAND OR SPEC..."
                                    className="w-full bg-white/5 border-b-4 border-white/10 h-28 md:h-40 pl-20 md:pl-32 pr-12 text-3xl md:text-7xl font-black italic tracking-tighter text-white uppercase placeholder:text-white/5 focus:outline-none focus:border-secondary transition-all"
                                />
                            </div>
                            <p className="text-[10px] md:text-sm font-black tracking-[0.5em] text-white/10 uppercase text-center italic">PRESS ENTER TO INITIALIZE GLOBAL SEARCH</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
