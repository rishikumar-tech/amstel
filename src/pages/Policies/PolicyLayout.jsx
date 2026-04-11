import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import BottomNav from '../../components/common/BottomNav';

const PolicyLayout = ({ title, highlight, infoText, children }) => {
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
                        {title} <span className="text-secondary">{highlight}</span>
                    </h1>
                    <div className="h-2 w-32 md:w-64 bg-secondary rounded-full" />
                    <p className="text-[10px] md:text-xs lg:text-sm font-black tracking-[0.5em] text-white/30 uppercase mt-2 italic">
                        {infoText}
                    </p>
                </div>

                <div className="glass p-8 md:p-12 rounded-[40px] border-white/5 bg-white/5 shadow-2xl mb-24 max-w-4xl">
                    <div className="flex flex-col">
                        {children}
                    </div>
                </div>
            </motion.main>

            <BottomNav />
        </div>
    );
};

export default PolicyLayout;
