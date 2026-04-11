import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, ShieldCheck, Truck, Clock, Zap, ChevronRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import axios from 'axios';

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
      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </button>
  );
};

/* ─── Reusable Image Brand Card ─── */
const BrandCard = ({ name, tagline, image, color, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ scale: 1.04 }}
    className="snap-center flex-shrink-0 cursor-pointer group"
  >
    <div className="relative w-36 md:w-44 h-20 md:h-24 rounded-2xl overflow-hidden border border-white/8
                    hover:border-secondary/40 transition-all duration-300 shadow-lg hover:shadow-secondary/10 hover:shadow-xl">
      {/* Background image */}
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110
                   group-hover:brightness-110 transition-all duration-500 ease-out"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20
                      group-hover:from-black/70 group-hover:via-black/25 transition-all duration-400" />
      {/* Colored accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: color || '#e63946' }}
      />
      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <span className="block text-xs md:text-sm font-black italic text-white tracking-tight leading-none mb-0.5">
          {name}
        </span>
        {tagline && (
          <span className="block text-[8px] font-bold uppercase tracking-widest text-white/45 group-hover:text-white/65 transition-colors">
            {tagline}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const bgScale = useTransform(scrollY, [0, 600], [1.08, 1.18]);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState([
    { name: 'Helmets', icon: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200&auto=format&fit=crop', path: '/shop?category=Helmets' },
    { name: 'Jackets', icon: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop', path: '/shop?category=Jackets' },
    { name: 'Gloves', icon: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=200&auto=format&fit=crop', path: '/shop?category=Gloves' },
    { name: 'Boots', icon: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop', path: '/shop?category=Boots' },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';
        const res = await axios.get(`${API_URL}/products`);
        if (res.data.success) {
          const allProducts = res.data.products;

          const categoryGroups = allProducts.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
          }, {});

          const iconMapping = {
            'helmets': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200&auto=format&fit=crop',
            'jackets': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop',
            'gloves': 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=200&auto=format&fit=crop',
            'boots': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'
          };

          const dynamicCats = Object.keys(categoryGroups).map(catName => ({
            name: catName,
            icon: iconMapping[catName.toLowerCase()] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200&auto=format&fit=crop',
            path: `/shop?category=${encodeURIComponent(catName)}`
          })).slice(0, 6);

          if (dynamicCats.length > 0) setCategories(dynamicCats);

          let selected = [];
          Object.values(categoryGroups).forEach(group => {
            const shuffledGroup = [...group].sort(() => 0.5 - Math.random());
            selected.push(...shuffledGroup.slice(0, 2));
          });

          const finalProducts = selected
            .sort(() => 0.5 - Math.random())
            .slice(0, 15);

          setFeaturedProducts(finalProducts);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ─── Gear Brands with images ─── */
  const brands = [
    {
      name: 'LS2',
      tagline: 'Racing Heritage',
      color: '#e63946',
      image: '/LS2.jpeg',
    },
    {
      name: 'SMK',
      tagline: 'Precision Crafted',
      color: '#f4a261',
      image: '/SMK.jpeg',
    },
    {
      name: 'MT',
      tagline: 'Born to Race',
      color: '#2ec4b6',
      image: '/MT.jpeg',
    },
    {
      name: 'Vega',
      tagline: 'Value & Safety',
      color: '#a8dadc',
      image: '/VEGA.jpeg',
    },
    {
      name: 'Steelbird',
      tagline: 'Indian Icon',
      color: '#f1faee',
      image: '/SB.jpeg',
    },
    {
      name: 'Royal Enfield',
      tagline: 'Classic Riders',
      color: '#e9c46a',
      image: '/RE.jpeg',
    },
    {
      name: 'Ryder',
      tagline: 'Ride in Style',
      color: '#e9c46a',
      image: '/RYDER.jpeg',
    },
    {
      name: 'Ridex',
      tagline: 'Riders Choice',
      color: '#e9c46a',
      image: '/RIDEX.jpeg',
    },
    {
      name: 'Studds',
      tagline: 'Riders Gear',
      color: '#e9c46a',
      image: '/STUDDS.jpeg',
    },
  ];

  /* ─── Bike Brands ─── */
  const bikeBrands = [
    {
      name: 'Royal Enfield',
      image: '/GT650.jpeg',
    },
    {
      name: 'KTM',
      image: '/390.jpeg',
    },
    {
      name: 'Yamaha',
      image: '/R15.jpeg',
    },
    {
      name: 'Kawasaki',
      image: '/z900.jpeg',
    },
    {
      name: 'BMW',
      image: '/S1000rr.jpeg',
    },
    {
      name: 'Bajaj',
      image: "/NS200.jpeg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 bg-black overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-[95vh] md:h-screen w-full flex items-center overflow-hidden">

        <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: bgScale }}>
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop"
            alt="Hero"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/55 to-black/20" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[40%] z-[1] bg-secondary/10 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 md:px-12 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
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

            <div className="flex gap-3 flex-wrap">
              <StatBadge value="100K+" label="Riders Served" delay={0.9} />
              <StatBadge value="4.9★" label="Avg Rating" delay={1.0} />
            </div>
          </motion.div>
        </div>

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

      {/* ═══════════════ FEATURED GEAR BRANDS ═══════════════ */}
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

        {/* Horizontal scroll strip — now image-based cards */}
        <div className="flex gap-5 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {brands.map((brand, i) => (
            <BrandCard
              key={i}
              index={i}
              name={brand.name}
              tagline={brand.tagline}
              image={brand.image}
              color={brand.color}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ BIKE BRANDS ═══════════════ */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-black to-dark-accent/30 overflow-hidden">
        <FadeUp className="container mx-auto px-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary mb-1">Shop By Bike</p>
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase">
              🏍️ BIKE BRANDS
            </h2>
          </div>
          <NavLink to="/shop" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-secondary transition-colors flex items-center gap-1">
            VIEW ALL <ChevronRight size={14} />
          </NavLink>
        </FadeUp>

        {/* Horizontal scroll — wider cards for bike brands */}
        <div className="flex gap-5 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {bikeBrands.map((bike, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ scale: 1.04 }}
              className="snap-center flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-48 md:w-60 h-28 md:h-36 rounded-2xl overflow-hidden border border-white/8
                              hover:border-secondary/40 transition-all duration-300 shadow-lg hover:shadow-secondary/15 hover:shadow-xl">
                {/* Background image */}
                <img
                  src={bike.image}
                  alt={bike.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110
                             group-hover:brightness-110 transition-all duration-500 ease-out"
                />
                {/* Gradient overlay — lighter on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10
                                group-hover:from-black/75 group-hover:via-black/20 transition-all duration-400" />
                {/* Red shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/0 via-secondary/0 to-secondary/0
                                group-hover:from-secondary/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                {/* Bike name */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="block text-sm md:text-base font-black italic text-white tracking-tighter leading-none">
                    {bike.name}
                  </span>
                  <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 mt-0.5 group-hover:text-secondary/70 transition-colors">
                    Shop Gear →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES BAR ═══════════════ */}
      <section className="relative py-20 md:py-28 border-y border-white/5 overflow-hidden">
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
            { icon: Truck, color: 'text-orange-400', border: 'group-hover:border-orange-400/50 group-hover:shadow-orange-400/20', label: 'EXPRESS SHIPPING', sub: 'PAN INDIA REACH IN 5-7 DAYS' },
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

        <ProductGrid products={featuredProducts} isLoading={isLoading} />
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