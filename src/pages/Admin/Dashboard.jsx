import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, ShoppingCart, DollarSign, Package, ArrowUpRight, Clock, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        activeProducts: 0
    });
    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [statRes, orderRes, chartRes] = await Promise.all([
                axios.get(`${API_URL}/admin/stats`),
                axios.get(`${API_URL}/orders`),
                axios.get(`${API_URL}/admin/charts`)
            ]);

            if (statRes.data.success) setStats(statRes.data.stats);
            if (chartRes.data.success) setChartData(chartRes.data.chart);
            if (orderRes.data.success) setRecentOrders(orderRes.data.orders.slice(0, 5));
        } catch (error) {
            console.error('Fetch dashboard error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Polling for notification/real-time updates
        const interval = setInterval(fetchData, 60000); // 1 minute polling
        return () => clearInterval(interval);
    }, []);

    const cards = [
        { name: 'TOTAL REVENUE', value: `₹${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/5' },
        { name: 'TOTAL ORDERS', value: stats.totalOrders.toLocaleString(), change: '+8.2%', icon: ShoppingCart, color: 'text-secondary', bg: 'bg-secondary/5' },
        { name: 'TOTAL CUSTOMERS', value: stats.totalCustomers.toLocaleString(), change: '+5.4%', icon: Users, color: 'text-white', bg: 'bg-white/5' },
        { name: 'ACTIVE PRODUCTS', value: stats.activeProducts.toLocaleString(), change: '+12', icon: Package, color: 'text-primary', bg: 'bg-primary/5' },
    ];

    return (
        <AdminLayout>
            <div className="flex flex-col gap-8 md:gap-12 pb-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">COMMAND <span className="text-secondary">CENTER</span></h1>
                        <p className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase mt-1">REAL-TIME BUSINESS ANALYTICS</p>
                    </div>
                    <Button onClick={fetchData} variant="outline" size="sm" className="h-11 px-5 rounded-xl border-white/5 bg-white/5 font-black italic text-xs tracking-widest self-start sm:self-auto whitespace-nowrap">
                        <RefreshCw size={14} className="mr-2 text-secondary" /> REFRESH
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {cards.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass rounded-2xl md:rounded-[32px] p-5 md:p-8 border border-white/5 bg-gradient-to-br from-white/5 to-transparent shadow-xl relative overflow-hidden group hover:border-white/10 transition-all"
                        >
                            <div className="flex items-start justify-between mb-5 md:mb-10 relative z-10">
                                <div className={`w-11 h-11 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon size={20} className="md:hidden" />
                                    <stat.icon size={32} className="hidden md:block" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-secondary tracking-widest leading-none mb-1">
                                        <ArrowUpRight size={12} /> {stat.change}
                                    </div>
                                    <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em] hidden sm:block">LAST MONTH</span>
                                </div>
                            </div>
                            <h3 className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-1 italic">{stat.name}</h3>
                            <p className="text-2xl md:text-4xl font-black italic text-white tracking-tighter uppercase">{isLoading ? '...' : stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                             <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">REVENUE <span className="text-primary">ANALYTICS</span></h2>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                <div className="w-2 h-2 rounded-full bg-primary" /> REAL-TIME TREND
                             </div>
                        </div>
                        
                        <div className="glass rounded-2xl lg:rounded-[32px] p-4 md:p-6 lg:p-8 h-[240px] md:h-[300px] lg:h-[400px] border border-white/5 bg-white/5 shadow-inner overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#e21d1d" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#e21d1d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="rgba(255,255,255,0.3)" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 900 }}
                                    />
                                    <YAxis 
                                        stroke="rgba(255,255,255,0.3)" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => `₹${value/1000}K`}
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 900 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '9px', color: '#fff' }}
                                        itemStyle={{ color: '#e21d1d', fontWeight: 900, textTransform: 'uppercase' }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#e21d1d" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="flex flex-col gap-8">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white px-2">RECENT <span className="text-secondary">STREAM</span></h2>
                        <div className="flex flex-col gap-4">
                            {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass rounded-2xl p-6 border border-white/5 bg-white/5 flex flex-col gap-4 group hover:border-secondary/20 transition-all shadow-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase italic text-white/40">#{order.id.toString().slice(-6)}</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                            <span className="text-[10px] font-black text-secondary italic">₹{order.total_amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase text-white italic truncate">{order.user_name}</span>
                                        <span className="text-[8px] font-black text-white/20 tracking-[0.2em]">{new Date(order.created_at).toLocaleDateString()} AT {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="glass rounded-2xl p-10 border border-white/5 bg-white/5 flex flex-col items-center justify-center text-center">
                                    <Clock size={32} className="text-white/10 mb-4" />
                                    <span className="text-[10px] font-black uppercase italic text-white/20 tracking-widest leading-relaxed">NO RECENT ACTIVITY DETECTED<br/>IN THE SYSTEM JOURNAL</span>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => navigate('/admin/orders')} variant="ghost" className="h-16 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest italic text-white/30 hover:text-white transition-all shadow-2xl">
                            VIEW GLOBAL JOURNAL
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
