import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cartCount = useCartStore(state => state.items.length);
    const location = useLocation();
    const navigate = useNavigate();

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
            setSearchQuery('');
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
                                src="/AR LOGO.png"
                                alt="AR LOGO"
                                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
                            />
                        </div>

                        {/* Text Container */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl md:text-3xl lg:text-4xl font-black italic tracking-tighter text-white leading-[0.8]">
                                AMSTEL
                            </h1>
                            <span className="text-[8px] md:text-[10px] lg:text-[12px] font-bold tracking-[0.25em] text-primary uppercase mt-1">
                                RIDERS HELMETS
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

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-8">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-white/60 hover:text-white transition-all duration-300 transform hover:scale-110"
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
                        <button
                            className="lg:hidden text-white/60 hover:text-white p-2 glass rounded-xl border-white/10"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
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
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 w-[85%] sm:w-[400px] bg-black border-l border-white/10 z-[70] lg:hidden flex flex-col p-8 md:p-12 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-16">
                                    <span className="text-xl font-black italic tracking-tighter uppercase">NAVIGATION</span>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white/50 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col space-y-8">
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
                                                text-3xl md:text-4xl font-black uppercase tracking-tighter italic block transition-all
                                                ${isActive ? 'text-secondary scale-105 origin-left' : 'text-white/40 hover:text-white'}
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
                                        <a href="tel:07860844044" className="text-white/40 hover:text-white transition-colors"><Phone size={20} /></a>
                                        <a href="mailto:amstelriders@gmail.com" className="text-white/40 hover:text-white transition-colors"><Mail size={20} /></a>
                                        <a href="https://wa.me/917860844044" className="text-white/40 hover:text-white transition-colors"><MessageCircle size={20} /></a>
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
