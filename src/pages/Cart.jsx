import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import useCartStore from '../store/useCartStore';

const Cart = () => {
    const { items, clearCart, getTotalAmount } = useCartStore();
    const navigate = useNavigate();
    const subtotal = getTotalAmount();
    const shipping = subtotal > 1000 ? 0 : 150;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="flex flex-col min-h-screen bg-black">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-6 text-center pt-32">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-32 h-32 rounded-full glass flex items-center justify-center text-white/10 mb-8 border-white/5 shadow-2xl"
                    >
                        <ShoppingBag size={64} />
                    </motion.div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-4">YOUR CART IS EMPTY</h2>
                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-10 max-w-xs">Looks like you haven't added any gear yet. Safe rides require solid protection!</p>
                    <NavLink to="/shop">
                        <Button size="lg" className="h-16 px-10 rounded-2xl italic font-black">
                            START SHOPPING <ArrowRight className="ml-2" />
                        </Button>
                    </NavLink>
                </main>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black pb-28 md:pb-12">
            <Navbar />
            
            <main className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40 max-w-7xl">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.85] mb-4">
                            YOUR <span className="text-secondary">BAG</span>
                        </h1>
                        <div className="h-1.5 w-32 bg-secondary rounded-full mb-4" />
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/30 italic">
                            {items.length} {items.length === 1 ? 'SYSTEM' : 'SYSTEMS'} READY FOR DEPLOYMENT
                        </p>
                    </div>
                    <button 
                        onClick={clearCart}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-secondary hover:translate-x-[-10px] transition-all duration-300"
                    >
                        <Trash2 size={14} /> PURGE ALL ITEMS
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Item List */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                        
                        <NavLink to="/shop" className="mt-4 flex items-center gap-2 text-xs font-black italic uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={16} /> CONTINUE SHOPPING
                        </NavLink>
                    </div>

                    {/* Order Summary */}
                    <div className="flex flex-col gap-6">
                        <div className="glass rounded-3xl p-8 border-white/5 sticky top-32 shadow-2xl">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6 border-b border-white/10 pb-4">ORDER SUMMARY</h3>
                            
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between text-sm font-black italic uppercase tracking-tighter text-white/60">
                                    <span>SUBTOTAL</span>
                                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-black italic uppercase tracking-tighter text-white/60">
                                    <span>SHIPPING</span>
                                    <span className={shipping === 0 ? "text-primary italic" : "text-white"}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Add ₹{(1000 - subtotal).toLocaleString()} more for free delivery!</p>
                                )}
                            </div>

                            <div className="flex justify-between text-2xl font-black italic uppercase tracking-tighter text-white border-t border-white/10 pt-6 mb-8">
                                <span>TOTAL</span>
                                <span className="text-secondary">₹{total.toLocaleString()}</span>
                            </div>

                            <Button 
                                size="lg" 
                                className="w-full h-16 rounded-2xl italic font-black shadow-xl"
                                onClick={() => navigate('/checkout')}
                            >
                                PROCEED TO CHECKOUT <ArrowRight className="ml-2" />
                            </Button>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                                    <ShieldCheck size={16} className="text-primary" /> SECURE SEC SSL PAYMENT
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                                    <Truck size={16} className="text-secondary" /> PAN INDIA DOORSTEP DELIVERY
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default Cart;
