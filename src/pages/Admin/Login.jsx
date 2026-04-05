import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/ui/Button';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(credentials.email, credentials.password);
        if (success) {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-primary/5 pointer-events-none" />
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] glass rounded-[32px] p-6 md:p-12 border border-white/5 relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] mx-4 md:mx-0"
            >
                <div className="flex flex-col items-center mb-8 md:mb-12">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary shadow-lg shadow-secondary/30 flex items-center justify-center mb-6 md:mb-8 animate-pulse">
                        <Lock size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black italic italic uppercase tracking-tighter text-white text-center">
                        ADMIN <span className="text-secondary">SYSTEMS</span>
                    </h1>
                    <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mt-2">RESTRICTED ACCESS ONLY</span>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 text-xs font-black text-red-500 uppercase tracking-widest">
                            <ShieldAlert size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2 italic">ADMIN EMAIL</label>
                        <div className="relative group">
                            <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" />
                            <input 
                                type="email" required name="email" value={credentials.email} onChange={handleChange}
                                placeholder="ADMIN@AMSTELRIDERS.COM"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 pl-16 pr-6 text-xs font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-end ml-2">
                             <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">ACCESS PASSWORD</label>
                             <button type="button" className="text-[8px] font-bold text-secondary uppercase hover:underline">FORGOT?</button>
                        </div>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" />
                            <input 
                                type="password" required name="password" value={credentials.password} onChange={handleChange}
                                placeholder="ENTER SECURE KEY"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 pl-16 pr-6 text-xs font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        size="lg" 
                        isLoading={isLoading}
                        className="h-16 rounded-2xl italic font-black shadow-2xl mt-4"
                    >
                        INITIATE LOGIN <LogIn size={18} className="ml-3" />
                    </Button>

                    <div className="flex items-center justify-center gap-6 mt-8">
                        <div className="h-px bg-white/5 flex-1" />
                        <span className="text-[8px] font-bold text-white/20 tracking-widest uppercase">ENCRYPTED END-TO-END</span>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>
                </form>
            </motion.div>

            <div className="fixed bottom-0 left-0 w-full p-8 flex items-center justify-center gap-12 opacity-10 pointer-events-none">
                <span className="text-9xl font-black italic uppercase tracking-tighter text-white">AMSTEL</span>
                <span className="text-9xl font-black italic uppercase tracking-tighter text-white">RIDERS</span>
            </div>
        </div>
    );
};

export default AdminLogin;
