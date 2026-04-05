import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Navigation, ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/ui/Button';

const Contact = () => {
    const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=12.9434363,79.1375238";
    const googleMapsEmbedUrl = "https://www.google.com/maps?q=12.9434363,79.1375238&output=embed";

    return (
        <div className="flex flex-col min-h-screen bg-black text-white selection:bg-secondary selection:text-white pb-28 md:pb-12">
            <Navbar />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-6 pt-32 lg:pt-40 max-w-7xl"
            >
                {/* Header Title Layer */}
                <div className="flex flex-col mb-16 lg:mb-24 gap-6">
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                        CONNECT <span className="text-secondary">NOW.</span>
                    </h1>
                    <div className="h-2 w-32 md:w-64 bg-secondary rounded-full" />
                    <p className="text-[10px] md:text-xs lg:text-sm font-black tracking-[0.5em] text-white/30 uppercase mt-2 italic">TECHNICAL SUPPORT • BUSINESS ENQUIRIES • GEAR HUB</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-24">
                    {/* Left Side: Contact Information & Form */}
                    <div className="flex flex-col gap-12 order-2 lg:order-1">
                        {/* Enquiry Form */}
                        <div className="glass p-8 md:p-12 rounded-[40px] border-white/5 bg-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MessageCircle size={120} />
                            </div>

                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
                                SEND AN <span className="text-secondary">ENQUIRY</span>
                            </h2>

                            <form className="flex flex-col gap-6 relative z-10" onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData.entries());
                                try {
                                    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
                                    const res = await axios.post(`${API_URL}/admin/enquiries`, data);
                                    if (res.data.success) {
                                        alert('ENQUIRY TRANSMITTED SUCCESSFULLY!');
                                        e.target.reset();
                                    }
                                } catch (err) {
                                    alert('TRANSMISSION FAILED. PLEASE TRY AGAIN.');
                                }
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic ml-1">FULL NAME</label>
                                        <input
                                            name="name" required type="text" placeholder="EX: ARJUN REDDY"
                                            className="h-14 bg-black/50 border border-white/10 rounded-xl px-6 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic ml-1">MOBILE NO</label>
                                        <input
                                            name="phone" required type="tel" placeholder="EX: 98765 43210"
                                            className="h-14 bg-black/50 border border-white/10 rounded-xl px-6 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic ml-1">EMAIL ADDRESS</label>
                                    <input
                                        name="email" required type="email" placeholder="EX: ARJUN@EXAMPLE.COM"
                                        className="h-14 bg-black/50 border border-white/10 rounded-xl px-6 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic ml-1">YOUR MESSAGE</label>
                                    <textarea
                                        name="message" required rows="4" placeholder="HOW CAN WE ASSIST YOU?"
                                        className="bg-black/50 border border-white/10 rounded-xl p-6 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-secondary transition-all resize-none"
                                    />
                                </div>

                                <Button type="submit" size="lg" className="h-16 rounded-2xl italic font-black text-sm tracking-widest uppercase shadow-2xl mt-4">
                                    TRANSMIT ENQUIRY <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </form>
                        </div>

                        <div className="flex flex-col gap-10">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter border-b border-white/10 pb-4">OFFICIAL CHANNELS</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
                                <a href="tel:+917868844044" className="glass p-6 md:p-8 rounded-3xl border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-secondary/20">
                                        <Phone size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic mb-2">PHONE NUMBER</span>
                                        <span className="text-base md:text-lg font-black italic text-white tracking-widest whitespace-nowrap">+91 78688 44044</span>
                                    </div>
                                </a>

                                <a href="mailto:support@amstelriders.com" className="glass p-6 md:p-8 rounded-3xl border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
                                        <Mail size={24} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic mb-2">EMAIL ADDRESS</span>
                                        <span className="text-sm md:text-lg font-black italic text-white tracking-widest break-all">amstelriders@gmail.com</span>
                                    </div>
                                </a>

                                <a href="https://wa.me/917868844044" target="_blank" rel="noopener noreferrer" className="glass p-6 md:p-8 rounded-3xl border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col gap-4 group md:col-span-2 xl:col-span-1">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-green-500/20">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic mb-2">WHATSAPP CHAT</span>
                                        <span className="text-sm md:text-lg font-black italic text-white tracking-widest">CONNECT INSTANTLY</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h2 className="text-xl font-black italic uppercase tracking-tighter border-b border-white/10 pb-4">VISIT OUR GEAR HUB</h2>
                            <div className="flex items-start gap-4 md:gap-6 glass p-6 md:p-8 rounded-3xl border-white/5 bg-white/5 shadow-xl">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic mb-2">LOCATION</span>
                                    <p className="text-sm md:text-base font-black italic text-white tracking-widest leading-relaxed uppercase">
                                        AMSTEL RIDERS HELMETS <br />
                                        Vellore - Katpadi Road, <br />
                                        Near New Bus Stand, <br />
                                        Vellore, Tamil Nadu 632004
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 glass p-8 rounded-3xl border-white/5 bg-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                                    <Clock size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic mb-2">OPENING HOURS</span>
                                    <p className="text-sm font-black italic text-white tracking-widest leading-relaxed">
                                        MON - SAT: 10:00 AM - 09:00 PM <br />
                                        SUN: 11:00 AM - 07:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Map Integration */}
                    <div className="flex flex-col gap-8 order-1 lg:order-2">
                        <div className="relative group overflow-hidden rounded-[32px] border border-white/10 shadow-2xl h-[400px] md:h-[500px]">
                            <iframe
                                src={googleMapsEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale contrast-125 opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                                title="Amstel Riders Location"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Button
                                onClick={() => window.open(googleMapsUrl, "_blank")}
                                className="flex-1 h-16 md:h-20 rounded-2xl font-black italic text-sm tracking-widest uppercase shadow-2xl group"
                            >
                                <Navigation size={20} className="mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                GET DIRECTIONS
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=AMSTEL+RIDERS+HELMETS", "_blank")}
                                className="flex-1 h-16 md:h-20 rounded-2xl font-black italic text-sm tracking-widest uppercase border-white/10 bg-white/5 hover:bg-white/10 group"
                            >
                                <ExternalLink size={20} className="mr-3 group-hover:opacity-50 transition-opacity" />
                                OPEN IN GOOGLE MAPS
                            </Button>
                        </div>

                        <div className="p-6 glass rounded-2xl border-white/5 bg-secondary/10 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-white/50 italic text-center">
                            READY TO GEAR UP? VISIT OUR PHYSICAL STORE IN VELLORE.
                        </div>
                    </div>
                </div>
            </motion.main>

            <BottomNav />
        </div>
    );
};

export default Contact;
