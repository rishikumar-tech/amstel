import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Calendar, Hash, Percent, Clock, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [form, setForm] = useState({
        code: '',
        discount_percent: '',
        expiry_date: '',
        usage_limit: ''
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/coupons`);
            if (response.data.success) setCoupons(response.data.coupons);
        } catch (error) {
            console.error('Fetch coupons error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/coupons`, form);
            if (response.data.success) {
                fetchCoupons();
                setIsModalOpen(false);
                setForm({ code: '', discount_percent: '', expiry_date: '', usage_limit: '' });
            }
        } catch (error) {
            alert('Failed to create coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('PERMANENTLY DELETE THIS COUPON?')) return;
        try {
            setDeletingId(id);
            await axios.delete(`${API_URL}/coupons/${id}`);
            fetchCoupons();
        } catch (error) {
            alert('Delete failed');
        } finally {
            setDeletingId(null);
        }
    };

    const isExpired = (date) => new Date(date) < new Date();

    return (
        <AdminLayout>
            <div className="flex flex-col gap-8 pb-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                            PROMO <span className="text-secondary">MANAGEMENT</span>
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-1">
                            CONFIGURE DISCOUNTS AND CAMPAIGN CODES
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        size="lg"
                        className="h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl italic font-black shadow-2xl text-xs md:text-sm whitespace-nowrap self-start sm:self-auto"
                    >
                        <Plus size={18} className="mr-2" /> NEW COUPON
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Coupons', value: coupons.length, icon: Tag, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Active', value: coupons.filter(c => !isExpired(c.expiry_date)).length, icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10' },
                        { label: 'Expired', value: coupons.filter(c => isExpired(c.expiry_date)).length, icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/10' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${color} border border-white/5`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{label}</p>
                                <p className="text-2xl font-black italic text-white">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupons Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-36 glass rounded-2xl border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="glass rounded-3xl p-16 border border-white/5 flex flex-col items-center text-center">
                        <Tag size={48} className="text-white/5 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">NO COUPONS CREATED YET</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {coupons.map((coupon, i) => {
                                const expired = isExpired(coupon.expiry_date);
                                return (
                                    <motion.div
                                        key={coupon.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`glass rounded-2xl border p-5 flex flex-col gap-3 group transition-all ${expired ? 'border-white/5 opacity-50' : 'border-white/10 hover:border-secondary/30'
                                            }`}
                                    >
                                        {/* Top row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="text-lg font-black italic tracking-widest text-secondary">{coupon.code}</span>
                                                <span className={`ml-2 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${expired ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-400'
                                                    }`}>
                                                    {expired ? 'EXPIRED' : 'ACTIVE'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                disabled={deletingId === coupon.id}
                                                className="w-9 h-9 rounded-xl glass border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-all flex-shrink-0"
                                            >
                                                {deletingId === coupon.id
                                                    ? <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                    : <Trash2 size={15} />
                                                }
                                            </button>
                                        </div>

                                        {/* Stats row */}
                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Discount</span>
                                                <span className="text-sm font-black text-primary italic">{coupon.discount_percent}% OFF</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Used</span>
                                                <span className="text-sm font-black text-white/60 italic">{coupon.used_count}/{coupon.usage_limit || '∞'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Expires</span>
                                                <span className="text-[10px] font-black text-white/40 italic">{new Date(coupon.expiry_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Create Coupon Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="CREATE NEW COUPON">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic flex items-center gap-2">
                                <Tag size={11} className="text-secondary" /> Coupon Code
                            </label>
                            <input
                                type="text" required value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                placeholder="EX: SAVE50"
                                className="w-full bg-white/5 border border-white/10 rounded-xl h-13 px-5 text-sm font-black italic tracking-widest text-white uppercase focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic flex items-center gap-2">
                                <Percent size={11} className="text-primary" /> Discount (%)
                            </label>
                            <input
                                type="number" required value={form.discount_percent}
                                onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                                placeholder="EX: 10" max="99" min="1"
                                className="w-full bg-white/5 border border-white/10 rounded-xl h-13 px-5 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic flex items-center gap-2">
                                <Calendar size={11} /> Expiry Date
                            </label>
                            <input
                                type="date" required value={form.expiry_date}
                                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl h-13 px-5 text-xs font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic flex items-center gap-2">
                                <Hash size={11} /> Usage Limit
                            </label>
                            <input
                                type="number" required value={form.usage_limit}
                                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                                placeholder="EX: 100"
                                className="w-full bg-white/5 border border-white/10 rounded-xl h-13 px-5 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                    </div>
                    <Button type="submit" size="lg" className="h-14 rounded-xl font-black italic shadow-2xl tracking-widest">
                        SAVE COUPON <ArrowRight size={18} className="ml-2" />
                    </Button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Coupons;
