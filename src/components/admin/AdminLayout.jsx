import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Box, Layers, ShoppingCart, Users, Tag,
    LogOut, Menu, X, ChevronRight, Bell, FileText, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import axios from 'axios';

const AdminLayout = ({ children }) => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard',     path: '/admin',           icon: LayoutDashboard },
        { name: 'Brands',        path: '/admin/brands',    icon: Layers },
        { name: 'Models & Colors',path: '/admin/models',   icon: Box },
        { name: 'Orders',        path: '/admin/orders',    icon: ShoppingCart },
        { name: 'Reports',       path: '/admin/reports',   icon: FileText },
        { name: 'Coupons',       path: '/admin/coupons',   icon: Tag },
        { name: 'Enquiries',     path: '/admin/enquiries', icon: MessageCircle },
        { name: 'Customers',     path: '/admin/customers', icon: Users },
    ];

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${API_URL}/admin/stats`);
                if (res.data.success) setUnreadCount(res.data.stats.totalOrders > 0 ? 3 : 0);
            } catch {}
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 120000);
        return () => clearInterval(interval);
    }, []);

    // Close sidebar on route change
    useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

    const currentPath = menuItems.find(item => item.path === location.pathname)?.name || 'Admin';

    const SidebarContent = () => (
        <>
            {/* Brand */}
            <div className="px-6 pt-8 pb-8 flex items-center justify-between border-b border-white/5">
                <div className="flex flex-col leading-tight">
                    <span className="text-xl font-black italic tracking-tighter text-white">AMSTEL</span>
                    <span className="text-[9px] font-black tracking-[0.3em] text-primary uppercase">ADMIN PORTAL</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden w-9 h-9 rounded-xl glass border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const isActive = item.path === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.path);
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={`
                                flex items-center gap-3 px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${isActive
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            <item.icon size={17} className="flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                            {isActive && <ChevronRight size={13} className="ml-auto flex-shrink-0" />}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={() => { logout(); navigate('/admin/login'); }}
                    className="w-full h-12 rounded-xl flex items-center gap-3 px-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                    <LogOut size={17} /> LOGOUT
                </button>
                <div className="mt-3 px-4 py-3 glass rounded-xl border-white/5 bg-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-[9px] font-black flex-shrink-0">AR</div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black text-white italic truncate">{user?.email || 'ADMIN'}</span>
                        <span className="text-[7px] font-bold text-white/40 uppercase tracking-widest">MANAGER</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-secondary selection:text-white">

            {/* ── Mobile/Tablet Overlay ── */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar: Desktop (permanent) / Mobile-Tablet (drawer) ── */}
            {/* Desktop — always visible */}
            <aside className="hidden lg:flex w-64 xl:w-72 bg-[#0a0a0a] border-r border-white/5 flex-col flex-shrink-0 h-full">
                <SidebarContent />
            </aside>

            {/* Mobile/Tablet — slide-in drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="fixed inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 lg:hidden"
                    >
                        <SidebarContent />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top Header */}
                <header className="h-16 md:h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl glass border-white/5 text-white/50 hover:text-white transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-base md:text-xl font-black italic uppercase tracking-tighter text-white leading-tight">
                                {currentPath}
                            </h2>
                            <span className="text-[8px] md:text-[9px] font-black tracking-[0.3em] text-white/20 uppercase hidden sm:block">
                                AMSTEL RIDERS ADMIN
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="relative w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                            <Bell size={17} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-[#0a0a0a]" />
                            )}
                        </button>
                        <button
                            onClick={() => { logout(); navigate('/admin/login'); }}
                            className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl glass border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                            <LogOut size={15} /> <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <section className="flex-1 overflow-y-auto p-4 md:p-8 xl:p-12 no-scrollbar scroll-smooth">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        {children}
                    </motion.div>
                </section>

                {/* ── Mobile Bottom Nav Bar ── */}
                <nav className="lg:hidden flex-shrink-0 border-t border-white/5 bg-[#0a0a0a] px-1 py-2 flex items-center justify-around">
                    {menuItems.slice(0, 5).map((item) => {
                        const isActive = item.path === '/admin'
                            ? location.pathname === '/admin'
                            : location.pathname.startsWith(item.path);
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${
                                    isActive ? 'text-secondary' : 'text-white/30 hover:text-white'
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="text-[8px] font-black uppercase tracking-widest">{item.name.split(' ')[0]}</span>
                            </NavLink>
                        );
                    })}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-white/30 hover:text-white transition-all"
                    >
                        <Menu size={20} />
                        <span className="text-[8px] font-black uppercase tracking-widest">More</span>
                    </button>
                </nav>
            </main>
        </div>
    );
};

export default AdminLayout;
