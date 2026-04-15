import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviews`);
                if (res.data.success) {
                    setReviews(res.data.reviews.slice(0, 10)); // Limit to latest 10
                } else {
                    // Fallback demo data if API is empty
                    setReviews(DEFAULT_REVIEWS);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setReviews(DEFAULT_REVIEWS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const nextTrip = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
    const prevTrip = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

    if (isLoading) return null;
    if (reviews.length === 0) return null;

    return (
        <section className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-secondary/10 blur-[120px] rounded-full" />
            
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary mb-3">Community Intel</p>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                        THE RIDER'S <span className="text-secondary">JOURNAL</span>
                    </h2>
                </div>

                <div className="relative group">
                    <div className="overflow-hidden rounded-[32px] glass border border-white/5 bg-white/5 p-8 md:p-16">
                        <Quote size={60} className="text-secondary/20 absolute top-8 left-8" />
                        
                        <div className="relative z-10">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center text-center gap-8"
                            >
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={`${i < reviews[activeIndex].rating ? 'fill-secondary text-secondary' : 'text-white/10'}`} 
                                        />
                                    ))}
                                </div>

                                <p className="text-lg md:text-2xl font-black italic text-white uppercase tracking-tight leading-snug">
                                    "{reviews[activeIndex].comment}"
                                </p>

                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-black text-secondary tracking-widest uppercase italic">
                                        {reviews[activeIndex].name}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">VERIFIED RIDER</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <button 
                        onClick={prevTrip}
                        className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-secondary transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextTrip}
                        className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-secondary transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-10">
                        {reviews.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-secondary' : 'w-1.5 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const DEFAULT_REVIEWS = [
    { name: "RAHUL DESAI", rating: 5, comment: "THE LS2 HELMET IS ABSOLUTELY ROCK SOLID. FASTEST DELIVERY I'VE EVER EXPERIENCED FROM AN ONLINE STORE." },
    { name: "ANIKET VERMA", rating: 5, comment: "AMSTEL RIDERS HAS THE BEST GEAR COLLECTION IN INDIA. THE SIZING GUIDE WAS 100% ACCURATE." },
    { name: "PRIYA SHARMA", rating: 4, comment: "GOT MY GLOVES WITHIN 3 DAYS. PACKAGING WAS OVER-ENGINEERED FOR SAFETY. LOVE IT!" }
];

export default Testimonials;
