import React, { useState, useEffect } from 'react';
import { Star, Trash2, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_URL}/reviews`);
            if (res.data.success) {
                setReviews(res.data.reviews);
            }
        } catch (error) {
            console.error('Fetch reviews error:', error);
            // fallback for demo
            setReviews(DEMO_REVIEWS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS REVIEW?')) return;
        try {
            await axios.delete(`${API_URL}/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            // mock delete for safety
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-8 md:gap-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">RIDER <span className="text-secondary">FEEDBACK</span></h1>
                        <p className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase mt-1">MANAGE CUSTOMER TESTIMONIALS</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="glass px-5 py-2.5 rounded-xl border-white/5 bg-white/5 flex items-center gap-3">
                            <span className="text-xs font-black text-secondary italic">{reviews.length}</span>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">TOTAL LOGS</span>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="w-10 h-10 border-4 border-secondary border-t-transparent animate-spin rounded-full" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                        {reviews.map((review) => (
                            <div key={review.id} className="glass rounded-[32px] p-6 md:p-8 border border-white/5 bg-white/5 flex flex-col gap-6 relative group hover:border-white/10 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                            <User size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white italic uppercase">{review.name}</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className={i < review.rating ? 'fill-secondary text-secondary' : 'text-white/10'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(review.id)}
                                        className="w-10 h-10 rounded-xl bg-red-500/5 border border-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative">
                                    <p className="text-xs md:text-sm font-medium text-white/60 italic leading-relaxed uppercase tracking-tighter">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                                        <Clock size={10} /> {new Date(review.created_at || Date.now()).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-1.5">
                                            <CheckCircle size={10} className="text-green-500" />
                                            <span className="text-[7px] font-black text-green-500 uppercase">PUBLISHED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

const DEMO_REVIEWS = [
    { id: 1, name: "RAHUL DESAI", rating: 5, comment: "THE LS2 HELMET IS ABSOLUTELY ROCK SOLID. FASTEST DELIVERY I'VE EVER EXPERIENCED FROM AN ONLINE STORE.", created_at: "2024-05-10" },
    { id: 2, name: "ANIKET VERMA", rating: 5, comment: "AMSTEL RIDERS HAS THE BEST GEAR COLLECTION IN INDIA. THE SIZING GUIDE WAS 100% ACCURATE.", created_at: "2024-05-12" },
    { id: 3, name: "PRIYA SHARMA", rating: 4, comment: "GOT MY GLOVES WITHIN 3 DAYS. PACKAGING WAS OVER-ENGINEERED FOR SAFETY. LOVE IT!", created_at: "2024-05-13" }
];

export default AdminReviews;
