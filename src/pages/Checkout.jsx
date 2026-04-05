import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/ui/Button';
import useCartStore from '../store/useCartStore';

const Checkout = () => {
    const { items, getTotalAmount } = useCartStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);

    const subtotal = getTotalAmount();
    const discountAmount = subtotal * (discount / 100);
    const shipping = subtotal > 1000 ? 0 : 150;
    const total = subtotal - discountAmount + shipping;

    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        phone: '',
        address: '',
        pincode: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${API_URL}/coupons/apply`, { code: couponCode });
            if (res.data.success) {
                setDiscount(res.data.discount);
                setCouponApplied(true);
                alert(`Coupon applied! ${res.data.discount}% discount added.`);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid coupon code');
        }
    };

    const handlePhonePeCheckout = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Initiate PhonePe transaction via Backend
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const response = await axios.post(`${API_URL}/orders/checkout`, {
                ...formData,
                amount: total,
                items: items,
                couponCode: couponApplied ? couponCode : null
            });

            if (response.data.success && response.data.redirectUrl) {
                // REDIRECT TO PHONEPE SECURE GATEWAY
                window.location.href = response.data.redirectUrl;
                return;
            } else {
                throw new Error('Payment initiation failed');
            }
            
        } catch (error) {
            console.error('Checkout error:', error);
            setIsLoading(false);
            alert('Something went wrong during checkout. Please try again.');
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col min-h-screen bg-black">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-6 text-center pt-32">
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-4">EMPTY BAG</h2>
                    <Button size="lg" className="h-16 px-10 rounded-2xl italic font-black" onClick={() => navigate('/shop')}>GO TO SHOP</Button>
                </main>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black pb-28 md:pb-12">
            <Navbar />
            
            <motion.main 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40 max-w-7xl"
            >
                <div className="flex flex-col mb-12 lg:mb-20 gap-4">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
                        FINAL <span className="text-secondary">DEPLOYMENT</span>
                    </h1>
                    <div className="h-1.5 w-32 md:w-48 bg-secondary rounded-full" />
                    <p className="text-[10px] md:text-xs font-black tracking-[0.4em] text-white/30 uppercase italic">SECURE GATEWAY ACCESS INITIALIZED</p>
                </div>

                <form onSubmit={handlePhonePeCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Shipping Info Form */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <section className="glass rounded-3xl p-8 border-white/5 bg-white/5">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                                <Truck size={24} className="text-secondary" /> SHIPPING INFORMATION
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">FULL NAME</label>
                                    <input 
                                        type="text" required name="user_name" value={formData.user_name} onChange={handleChange}
                                        placeholder="EX: MAHESH KUMAR"
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">EMAIL ADDRESS</label>
                                    <input 
                                        type="email" required name="email" value={formData.email} onChange={handleChange}
                                        placeholder="EX: MAHESH@EXAMPLE.COM"
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">PHONE NUMBER</label>
                                    <input 
                                        type="tel" required name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="EX: 98765 43210"
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">PINCODE</label>
                                    <input 
                                        type="text" required name="pincode" value={formData.pincode} onChange={handleChange}
                                        placeholder="EX: 632001"
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">COMPLETE ADDRESS</label>
                                    <textarea 
                                        required name="address" value={formData.address} onChange={handleChange}
                                        placeholder="HOUSE NO, STREET, AREA NEAR BY..."
                                        rows="3"
                                        className="bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-black text-white italic tracking-widest placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Coupon Section */}
                        <section className="glass rounded-3xl p-6 md:p-8 border-white/5 bg-[#0a0a0a]">
                            <h3 className="text-[10px] font-black italic uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
                                <Tag size={16} className="text-secondary" /> HAVE A DISCOUNT COUPON?
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="EX: VELLORE50"
                                    disabled={couponApplied}
                                    className="flex-grow bg-black/50 border border-white/10 rounded-xl h-14 px-6 text-xs font-black italic tracking-[0.2em] text-white focus:outline-none focus:border-secondary disabled:opacity-30 transition-all"
                                />
                                <button 
                                    type="button" onClick={handleApplyCoupon} disabled={couponApplied || !couponCode}
                                    className="bg-white/5 border border-white/10 text-white rounded-xl px-10 h-14 text-[10px] font-black italic tracking-widest uppercase hover:bg-white/10 disabled:opacity-20 transition-all sm:w-auto w-full"
                                >
                                    {couponApplied ? 'APPLIED ✅' : 'APPLY CODE'}
                                </button>
                            </div>
                        </section>

                        <div className="flex items-center gap-2 p-6 glass rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">
                            <ShieldCheck size={20} className="text-primary mr-2" />
                            YOUR PERSONAL DATA WILL BE USED TO PROCESS YOUR ORDER AND FOR THE PURPOSES DESCRIBED IN OUR PRIVACY POLICY.
                        </div>
                    </div>

                    {/* Payment Side */}
                    <div className="flex flex-col gap-6">
                        <section className="glass rounded-3xl p-8 border-white/5 sticky top-32 shadow-2xl">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                                <CreditCard size={24} className="text-secondary" /> PAYMENT SUMMARY
                            </h3>
                            
                            <div className="flex flex-col gap-3 py-4 border-b border-white/5">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center gap-4 py-3 border-b border-white/5 last:border-0">
                                        <div className="flex-grow min-w-0">
                                            <p className="text-[10px] font-black italic uppercase text-white truncate line-clamp-1">{item.name}</p>
                                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">QTY: {item.quantity}</p>
                                        </div>
                                        <span className="text-xs font-black italic text-white flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 my-6 pt-0">
                                <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                    <span>SUBTOTAL</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-widest">
                                        <span>COUPON SAVINGS ({discount}%)</span>
                                        <span>- ₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                    <span>SHIPPING</span>
                                    <span className="text-primary font-black italic">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-2xl font-black italic uppercase tracking-tighter text-white mb-10 pt-4 border-t border-white/10">
                                <span>TOTAL</span>
                                <span className="text-secondary">₹{total.toLocaleString()}</span>
                            </div>

                            {/* PhonePe Specific Button Styled Premiumly */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative h-[72px] bg-[#5f259f] hover:bg-[#521f8a] rounded-2xl p-6 transition-all duration-300 disabled:opacity-50 group flex items-center justify-between shadow-[0_10px_30px_rgba(95,37,159,0.4)]"
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-white/80">PAY SECURELY WITH</span>
                                    <div className="flex items-center gap-2">
                                        <img src="phonepe.png" 
                                             alt="PhonePe" className="h-6 object-contain invert brightness-200" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-white italic tracking-tight">₹{total.toLocaleString()}</span>
                                    <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                                
                                {isLoading && (
                                    <div className="absolute inset-0 bg-[#5f259f] rounded-2xl flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent animate-spin rounded-full" />
                                    </div>
                                )}
                            </button>
                            
                        </section>

                        <button 
                            type="button"
                            onClick={() => navigate('/cart')}
                            className="flex items-center justify-center gap-2 text-xs font-black italic uppercase tracking-widest text-white/30 hover:text-white transition-colors py-4"
                        >
                            <ArrowLeft size={16} /> CHANGE ORDER SELECTION
                        </button>
                    </div>
                </form>
            </motion.main>

            <BottomNav />
        </div>
    );
};

export default Checkout;
