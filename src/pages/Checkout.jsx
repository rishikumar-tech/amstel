import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight, ArrowLeft, Tag, MapPin, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/ui/Button';
import useCartStore from '../store/useCartStore';

const Checkout = () => {
    const { items, getTotalAmount, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);

    // Initial formData state
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        phone: '',
        size: '',
        address: '',
        pincode: ''
    });

    // ── Delivery Calculation (Pincode & Distance Based) ──────────────────────────
    const [shippingCost, setShippingCost] = useState(0);
    const [distance, setDistance] = useState(null);

    // Store Location: Vellore, Tamil Nadu (632001) or prompt reference (620006)
    // Using user requested reference (620006)
    const storePincode = '620006';

    /**
     * Mock Distance Calculation based on India Pincodes (First 2 digits)
     * Real calculation would use Google Maps or Logistical API
     */
    const estimateDistance = (targetPin) => {
        if (!targetPin || targetPin.length < 3) return null;

        const firstDigit = targetPin[0];
        const secondDigit = targetPin[1];

        // Reference: 6 = South/TN
        if (firstDigit === '6') {
            if (secondDigit === '2' || secondDigit === '3') return 25 + Math.random() * 50; // Very close
            return 80 + Math.random() * 80; // Same state
        }
        if (firstDigit === '5') return 250 + Math.random() * 100; // Karnataka/AP
        if (firstDigit === '4') return 450 + Math.random() * 150; // MH/West
        if (firstDigit === '3') return 650 + Math.random() * 200; // GJ/Central
        if (firstDigit === '1' || firstDigit === '2') return 1200 + Math.random() * 400; // Delhi/UP/North
        if (firstDigit === '7' || firstDigit === '8') return 1600 + Math.random() * 300; // East/NE
        return 500; // Default
    };

    /**
     * Comprehensive Shipping Estimator
     * Logic: Highest Class (Helmet/Accessories) per Order
     */
    useEffect(() => {
        if (formData.pincode.length < 6) {
            setDistance(null);
            setShippingCost(0);
            return;
        }

        const estDist = estimateDistance(formData.pincode);
        setDistance(estDist);

        let highestShipping = 0;

        items.forEach(item => {
            let itemShipping = 0;

            // 1. Accessory Weight-Based Logic (Part 4)
            if (item.category === 'Accessories' && Array.isArray(item.delivery_rules) && item.delivery_rules.length > 0) {
                const weight = Number(item.weight) || 0;
                // Match with slab defined in admin
                const matchingRule = item.delivery_rules.find(r => weight >= Number(r.min) && weight <= Number(r.max));
                if (matchingRule) {
                    itemShipping = Number(matchingRule.charge);
                }
            }
            // 2. Helmet/General Distance-Based Logic (Part 3 & 5)
            else {
                if (estDist <= 100) itemShipping = 50;
                else if (estDist <= 300) itemShipping = 100;
                else if (estDist <= 500) itemShipping = 150;
                else itemShipping = 200;
            }

            if (itemShipping > highestShipping) highestShipping = itemShipping;
        });

        // Optimization: Free shipping over 15,000 for Helmets, but keep slabs active as per requirements
        setShippingCost(highestShipping);

    }, [formData.pincode, items]);


    const subtotal = getTotalAmount();
    const discountAmount = subtotal * (discount / 100);
    const shipping = shippingCost;
    const total = subtotal - discountAmount + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';
            const res = await axios.post(`${API_URL}/coupons/apply`, { code: couponCode });
            if (res.data.success) {
                setDiscount(res.data.discount);
                setCouponApplied(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid coupon code');
        }
    };

    const handleRazorpayCheckout = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

            const response = await axios.post(`${API_URL}/orders/checkout`, {
                ...formData,
                amount: total,
                shipping_charge: shipping,
                items: items,
                couponCode: couponApplied ? couponCode : null
            });

            if (response.data.success && response.data.razorpayOrderId) {
                const { razorpayOrderId, key, orderId, finalAmount, currency } = response.data;

                const options = {
                    key: key,
                    amount: Math.round(finalAmount * 100),
                    currency: currency,
                    name: "AMSTEL RIDERS",
                    description: "PREMIUM MOTORCYCLE GEAR",
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        try {
                            const verifyRes = await axios.post(`${API_URL}/orders/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderId
                            });

                            if (verifyRes.data.success) {
                                clearCart();
                                navigate('/success', { state: { orderId: orderId } });
                            }
                        } catch (error) {
                            console.error('Verification error:', error);
                            alert('Verification failed.');
                        }
                    },
                    prefill: {
                        name: formData.user_name,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: { color: "#e21d1d" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setIsLoading(false);
            alert('Something went wrong during checkout.');
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
                className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 lg:pt-40 max-w-7xl"
            >
                <div className="flex flex-col mb-12 lg:mb-20 gap-4">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
                        FINAL <span className="text-secondary">DEPLOYMENT</span>
                    </h1>
                    <div className="h-1.5 w-32 md:w-48 bg-secondary rounded-full" />
                    <p className="text-[10px] md:text-xs font-black tracking-[0.4em] text-white/30 uppercase italic">SECURE GATEWAY ACCESS INITIALIZED</p>
                </div>

                <form onSubmit={handleRazorpayCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">EMAIL ADDRESS</label>
                                    <input
                                        type="email" required name="email" value={formData.email} onChange={handleChange}
                                        placeholder="EX: MAHESH@EXAMPLE.COM"
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">PHONE NUMBER</label>
                                    <input
                                        type="tel" required name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="EX: 98765 43210"
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">SIZE <span className="text-white/20">(OPTIONAL)</span></label>
                                    <select
                                        name="size" value={formData.size} onChange={handleChange}
                                        className="bg-black/50 border border-white/10 rounded-xl h-14 px-4 text-sm font-black text-white italic tracking-widest focus:outline-none focus:border-secondary transition-all appearance-none"
                                    >
                                        <option value="" className="bg-black">SELECT SIZE</option>
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Other'].map(s => (
                                            <option key={s} value={s} className="bg-black">{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">PINCODE</label>
                                        <AnimatePresence>
                                            {distance && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="text-[9px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-0.5 rounded-lg border border-secondary/20"
                                                >
                                                    ESTIMATED: {Math.round(distance)} KM
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text" required name="pincode" value={formData.pincode} onChange={handleChange}
                                            placeholder="EX: 632001" maxLength="6"
                                            className="bg-black/50 border border-white/10 rounded-xl h-14 p-4 text-sm font-black text-white italic tracking-widest focus:outline-none focus:border-secondary w-full"
                                        />
                                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic ml-1">COMPLETE ADDRESS</label>
                                    <textarea
                                        required name="address" value={formData.address} onChange={handleChange}
                                        placeholder="HOUSE NO, STREET, AREA NEAR BY..."
                                        rows="3"
                                        className="bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-black text-white italic tracking-widest focus:outline-none focus:border-secondary resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="glass rounded-3xl p-6 md:p-8 border-white/5 bg-[#0a0a0a]">
                            <h3 className="text-[10px] font-black italic uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
                                <Tag size={16} className="text-secondary" /> HAVE A DISCOUNT COUPON?
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="EX: VELLORE50" disabled={couponApplied}
                                    className="flex-grow bg-black/50 border border-white/10 rounded-xl h-14 px-6 text-xs font-black italic tracking-[0.2em] text-white focus:outline-none focus:border-secondary disabled:opacity-30 transition-all font-black"
                                />
                                <button
                                    type="button" onClick={handleApplyCoupon} disabled={couponApplied || !couponCode}
                                    className="bg-white/5 border border-white/10 text-white rounded-xl px-10 h-14 text-[10px] font-black italic tracking-widest uppercase hover:bg-white/10 disabled:opacity-20 transition-all sm:w-auto w-full"
                                >
                                    {couponApplied ? 'APPLIED ✅' : 'APPLY CODE'}
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Payment Side */}
                    <div className="flex flex-col gap-6">
                        <section className="glass rounded-3xl p-8 border-white/5 sticky top-32 shadow-2xl">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                                <CreditCard size={24} className="text-secondary" /> PAYMENT SUMMARY
                            </h3>

                            <div className="flex flex-col gap-3 py-4 border-b border-white/5">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all p-2 rounded-xl">
                                        <div className="flex-grow min-w-0">
                                            <p className="text-[10px] font-black italic uppercase text-white truncate line-clamp-1">{item.name}</p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">QTY: {item.quantity}</span>
                                                {item.weight > 0 && <span className="text-[8px] font-black text-secondary/60 uppercase tracking-widest flex items-center gap-1"><Gauge size={8} /> {item.weight} KG</span>}
                                            </div>
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
                                        <span>SAVINGS</span>
                                        <span>- ₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest border-t border-white/5 pt-3">
                                    <span>DELIVERY CLASS</span>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-white font-black italic text-[11px]">
                                            {shipping === 0 ? (formData.pincode ? 'FREE DELIVERY' : 'PENDING PINCODE') : `₹${shipping}`}
                                        </span>
                                        {distance && <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em] italic">ZONE: {Math.round(distance)} KM</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-2xl font-black italic uppercase tracking-tighter text-white mb-10 pt-4 border-t border-white/10">
                                <span>TOTAL</span>
                                <span className="text-secondary">₹{total.toLocaleString()}</span>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full relative h-[72px] bg-secondary hover:bg-[#c11515] rounded-2xl p-6 transition-all duration-300 disabled:opacity-50 group flex items-center justify-between shadow-2xl"
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-white/80">AUTHENTICATE GATEWAY</span>
                                    <span className="font-black italic text-xs tracking-tight">INITIALIZE PAYMENT</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-white italic tracking-tight">₹{total.toLocaleString()}</span>
                                    <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                                {isLoading && (
                                    <div className="absolute inset-0 bg-secondary rounded-2xl flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent animate-spin rounded-full" />
                                    </div>
                                )}
                            </button>
                        </section>

                        <button
                            type="button" onClick={() => navigate('/cart')}
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
