import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Truck, Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/ui/Button';
import useCartStore from '../store/useCartStore';
import ReviewForm from '../components/common/ReviewForm';

const Success = () => {
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        // Clear cart on success page load
        clearCart();
    }, [clearCart]);

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar />
            
            <main className="flex-grow flex flex-col items-center justify-center p-6 text-center pt-32 pb-40">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="w-40 h-40 rounded-full bg-secondary shadow-[0_0_80px_rgba(239,68,68,0.3)] flex items-center justify-center mb-10 border-4 border-white/10"
                >
                    <CheckCircle size={80} className="text-white" strokeWidth={3} />
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none mb-6">
                    ORDER <span className="text-secondary">PLACED!</span>
                </h1>
                
                <p className="text-sm md:text-lg font-bold text-white/50 uppercase tracking-widest mb-12 max-w-xl leading-relaxed italic">
                    YOUR GEAR IS BEING PREPARED FOR THE ROAD. AN ORDER CONFIRMATION HAS BEEN SENT VIA <span className="text-primary italic">SMS & WHATSAPP.</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
                    <div className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center gap-3">
                        <Truck size={24} className="text-secondary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">FAST DELIVERY</h4>
                        <p className="text-xs font-bold text-white uppercase italic">3-7 WORKING DAYS</p>
                    </div>
                    <div className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center gap-3">
                        <Mail size={24} className="text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">EMAIL UPDATE</h4>
                        <p className="text-xs font-bold text-white uppercase italic">INVOICE SENT</p>
                    </div>
                    <div className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center gap-3">
                        <MessageSquare size={24} className="text-[#25D366]" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">TRACKING LINK</h4>
                        <p className="text-xs font-bold text-white uppercase italic">TO YOUR PHONE</p>
                    </div>
                </div>

                <div className="mb-16 w-full flex justify-center px-4">
                    <ReviewForm />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <NavLink to="/">
                        <Button size="lg" className="h-16 px-10 rounded-2xl italic font-black shadow-2xl">
                            BACK TO HOME
                        </Button>
                    </NavLink>
                    <NavLink to="/shop">
                        <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl italic font-black hover:bg-white/5 border-white/5">
                            BROWSE MORE GEAR <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </NavLink>
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default Success;
