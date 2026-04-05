import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, ShieldCheck, Truck, Clock, Zap, ChevronRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';

/* ─── Fade-up wrapper ─── */
const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Stat badge ─── */
const StatBadge = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className="flex flex-col items-center justify-center bg-white/8 backdrop-blur-xl border border-white/12
                rounded-2xl px-4 py-3 shadow-xl min-w-[90px]"
  >
    <span className="text-lg md:text-2xl font-black text-white leading-none">{value}</span>
    <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 mt-1 text-center">{label}</span>
  </motion.div>
);

/* ─── Shimmer CTA button ─── */
const ShimmerButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const base =
    'relative overflow-hidden group inline-flex items-center justify-center gap-2 font-black italic uppercase tracking-tight transition-all duration-300 rounded-2xl';
  const variants = {
    primary:
      'bg-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-secondary/60 hover:scale-[1.03] active:scale-[0.98]',
    outline:
      'border border-white/15 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.98]',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {/* shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const bgScale = useTransform(scrollY, [0, 600], [1.08, 1.18]);

  const featuredProducts = [
    { id: 1, name: 'LS2 Thunder Helmet', slug: 'ls2-thunder-helmet', price: 3999, compare_price: 4999, image_url: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1000&auto=format&fit=crop', brand: 'LS2', rating: '4.9', stock: 10 },
    { id: 2, name: 'SMK Stellar Helmet', slug: 'smk-stellar-helmet', price: 3999, compare_price: 4500, image_url: 'https://images.unsplash.com/photo-1542362567-b055002db2ed?q=80&w=1000&auto=format&fit=crop', brand: 'SMK', rating: '4.8', stock: 5 },
    { id: 3, name: 'Vega Crux Helmet', slug: 'vega-crux-helmet', price: 1800, compare_price: 2200, image_url: 'https://images.unsplash.com/photo-1599313289053-1574cc8295ee?q=80&w=1000&auto=format&fit=crop', brand: 'Vega', rating: '4.7', stock: 0 },
    { id: 4, name: 'MT Revenge 2', slug: 'mt-revenge-2', price: 7500, compare_price: 8500, image_url: 'https://images.unsplash.com/photo-1613933549102-882b54488497?q=80&w=1000&auto=format&fit=crop', brand: 'MT', rating: '4.9', stock: 20 },
  ];

  const categories = [
    { name: 'Helmets', icon: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200&auto=format&fit=crop', path: '/shop?category=helmets' },
    { name: 'Jackets', icon: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop', path: '/shop?category=jackets' },
    { name: 'Gloves', icon: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=200&auto=format&fit=crop', path: '/shop?category=gloves' },
    { name: 'Boots', icon: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop', path: '/shop?category=boots' },
  ];

  const brands = [
    { name: 'LS2', tagline: 'Racing Heritage', color: '#e63946' },
    { name: 'SMK', tagline: 'Precision Crafted', color: '#f4a261' },
    { name: 'MT', tagline: 'Born to Race', color: '#2ec4b6' },
    { name: 'Vega', tagline: 'Value & Safety', color: '#a8dadc' },
    { name: 'Steelbird', tagline: 'Indian Icon', color: '#f1faee' },
    { name: 'Royal Enfield', tagline: 'Classic Riders', color: '#e9c46a' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 bg-black overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-[95vh] md:h-screen w-full flex items-center overflow-hidden">

        {/* Parallax background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: bgScale }}>
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop"
            alt="Hero"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Rich overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/55 to-black/20" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
        {/* Red accent glow */}
        <div className="absolute bottom-0 left-0 w-[60%] h-[40%] z-[1] bg-secondary/10 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            {/* Rating pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-7"
            >
              <div className="flex items-center gap-1.5 bg-white/8 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} className="fill-secondary text-secondary" />)}
                <span className="text-[9px] md:text-[10px] font-black text-white/70 uppercase ml-2 tracking-widest">
                  4.9 Rated · Vellore, TN
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-black italic tracking-tighter leading-[0.85] mb-8 select-none">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="block text-white"
              >
                BEYOND
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="block text-secondary"
                style={{
                  textShadow: '0 0 60px rgba(230,57,70,0.55), 0 0 120px rgba(230,57,70,0.25)',
                  WebkitTextStroke: '1px rgba(230,57,70,0.3)',
                }}
              >
                LIMITS.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm md:text-lg font-bold text-white/45 mb-10 max-w-md leading-relaxed uppercase tracking-tighter italic"
            >
              Premium protective gear for the modern Indian rider. Speed. Safety. No compromises.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="grid grid-cols-2 gap-3 w-full sm:w-auto sm:flex sm:flex-row sm:gap-4 mb-12"
            >
              <ShimmerButton
                onClick={() => navigate('/shop')}
                variant="primary"
                className="h-14 md:h-16 lg:h-20 px-6 lg:px-12 text-xs md:text-sm lg:text-base w-full"
              >
                EXPLORE SHOP <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </ShimmerButton>
              <ShimmerButton
                onClick={() => navigate('/contact')}
                variant="outline"
                className="h-14 md:h-16 lg:h-20 px-6 lg:px-12 text-xs md:text-sm lg:text-base w-full"
              >
                GET IN TOUCH
              </ShimmerButton>
            </motion.div>

            {/* Floating stat badges */}
            <div className="flex gap-3 flex-wrap">
              <StatBadge value="100K+" label="Riders Served" delay={0.9} />
              <StatBadge value="4.9★" label="Avg Rating" delay={1.0} />
            </div>
          </motion.div>
        </div>

        {/* Desktop category bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 hidden md:block">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-3xl rounded-[40px] p-6 lg:p-8 flex items-center
                       justify-around border border-white/10 shadow-2xl"
          >
            {categories.map((cat, i) => (
              <NavLink key={i} to={cat.path} className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-white/10
                               group-hover:border-secondary transition-all duration-500 shadow-xl group-hover:scale-110">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:brightness-110"
                  />
                </div>
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </NavLink>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURED BRANDS ═══════════════ */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-black via-dark-accent/60 to-black border-y border-white/5 overflow-hidden">
        <FadeUp className="container mx-auto px-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary mb-1">Handpicked</p>
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase">
              🔥 FEATURED BRANDS
            </h2>
          </div>
          <NavLink to="/shop" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary transition-colors flex items-center gap-1">
            ALL BRANDS <ChevronRight size={14} />
          </NavLink>
        </FadeUp>

        {/* Horizontal scroll strip */}
        <div className="flex gap-5 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.06 }}
              className="snap-center flex-shrink-0 cursor-pointer group"
            >
              <div className="w-36 md:w-44 h-20 md:h-24 rounded-2xl bg-white/5 border border-white/8
                             backdrop-blur-md flex flex-col items-center justify-center gap-1
                             hover:border-secondary/40 hover:bg-white/10 transition-all duration-300
                             shadow-lg hover:shadow-secondary/10 hover:shadow-xl"
              >
                {/* Brand letter logo placeholder */}
                <span
                  className="text-2xl md:text-3xl font-black italic transition-all duration-300"
                  style={{
                    color: 'rgba(255,255,255,0.15)',
                    filter: 'grayscale(1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = brand.color;
                    e.currentTarget.style.filter = 'none';
                    e.currentTarget.style.textShadow = `0 0 30px ${brand.color}66`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.filter = 'grayscale(1)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {brand.name}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/25 group-hover:text-white/50 transition-colors">
                  {brand.tagline}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES BAR ═══════════════ */}
      <section className="relative py-20 md:py-28 border-y border-white/5 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-accent to-black" />
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(120deg, transparent 0%, rgba(230,57,70,0.15) 50%, transparent 100%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20">
          {[
            { icon: ShieldCheck, color: 'text-secondary', border: 'group-hover:border-secondary/50 group-hover:shadow-secondary/20', label: 'PRO PROTECTION', sub: 'ECE & DOT GLOBAL CERTIFIED' },
            { icon: Truck, color: 'text-orange-400', border: 'group-hover:border-orange-400/50 group-hover:shadow-orange-400/20', label: 'EXPRESS SHIPPING', sub: 'PAN INDIA REACH IN 72 HOURS' },
            { icon: Clock, color: 'text-white', border: 'group-hover:border-white/40 group-hover:shadow-white/10', label: 'RIDER SUPPORT', sub: 'TECHNICAL SIZING EXPERTS 24/7' },
          ].map(({ icon: Icon, color, border, label, sub }, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <div className="flex items-center gap-6 group cursor-default">
                <div className={`w-16 h-16 flex-shrink-0 rounded-3xl bg-white/5 backdrop-blur-md flex items-center justify-center
                                border border-white/10 ${border} shadow-lg transition-all duration-500
                                group-hover:-translate-y-2 group-hover:rotate-3 group-hover:shadow-xl ${color}`}>
                  <Icon size={30} />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black uppercase tracking-widest text-white mb-1 group-hover:text-secondary transition-colors duration-300">
                    {label}
                  </h4>
                  <p className="text-[10px] font-bold text-white/35 uppercase tracking-tighter">{sub}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════ PROMO BANNER ═══════════════ */}
      <section className="relative h-[55vh] md:h-[65vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2000&auto=format&fit=crop"
            alt="Promo"
            loading="lazy"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          {/* Red glow top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-secondary/80 blur-md" />
        </div>

        <FadeUp className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary mb-5">Premium Collection 2025</p>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter text-white leading-none mb-8"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}
          >
            BUILT FOR SPEED.<br />
            <span className="text-secondary">DESIGNED FOR SAFETY.</span>
          </h2>
          <ShimmerButton
            onClick={() => navigate('/shop')}
            variant="primary"
            className="h-14 md:h-16 px-10 md:px-16 text-sm"
          >
            EXPLORE GEAR <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </ShimmerButton>
        </FadeUp>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="py-24 md:py-32 container mx-auto px-6 md:px-12">
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary mb-3">Editor's Pick</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white uppercase mb-6 leading-none">
              TRENDING <span className="text-secondary">SYSTEMS</span>
            </h2>
            <div className="h-[3px] w-32 md:w-48 bg-gradient-to-r from-secondary to-orange-400 rounded-full" />
          </div>
          <NavLink
            to="/shop"
            className="group flex items-center gap-4 text-xs md:text-sm font-black tracking-widest uppercase text-white hover:text-secondary transition-all"
          >
            VIEW FULL CATALOG
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center
                           group-hover:border-secondary group-hover:bg-secondary/10 transition-all group-hover:scale-110">
              <ArrowRight size={20} />
            </div>
          </NavLink>
        </FadeUp>

        <ProductGrid products={featuredProducts} isLoading={false} />
      </section>

      {/* ═══════════════ MOBILE CATEGORIES ═══════════════ */}
      <section className="md:hidden px-6 py-14 bg-white/[0.02] border-t border-white/5">
        <div className="container mx-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25 mb-8 text-center italic">
            QUICK CATEGORY SCAN
          </p>
          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
            {categories.map((cat, i) => (
              <NavLink key={i} to={cat.path} className="flex flex-col items-center gap-3 snap-center flex-shrink-0 w-24 group">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10
                               group-hover:border-secondary/50 shadow-xl bg-white/5 p-1 transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                    />
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/45 group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MOBILE STICKY CTA ═══════════════ */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="fixed bottom-20 left-0 right-0 z-40 flex justify-center md:hidden pointer-events-none"
      >
        <ShimmerButton
          onClick={() => navigate('/shop')}
          variant="primary"
          className="h-12 px-10 text-xs shadow-2xl shadow-secondary/40 pointer-events-auto"
        >
          <Zap size={14} className="fill-white" /> SHOP NOW
        </ShimmerButton>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Home;