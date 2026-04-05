import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 50 }}
                        className="w-full max-w-2xl glass rounded-[32px] border border-white/5 bg-[#0a0a0a] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                                {title} <span className="text-secondary opacity-20">/ FORM</span>
                            </h3>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl glass border-white/5 transition-all hover:border-white/20 text-white/40 hover:text-white flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-10 py-10 max-h-[70vh] overflow-y-auto no-scrollbar scroll-smooth">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
