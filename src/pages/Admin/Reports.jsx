import React, { useState, useEffect } from 'react';
import { 
    Calendar, Download, Filter, FileText, TrendingUp, DollarSign, ShoppingBag, ArrowRight, Clock, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';

const Reports = () => {
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState({ totalSales: 0, orderCount: 0, revenue: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('30_days');
    const [dates, setDates] = useState({ start: '', end: '' });

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchReport = async () => {
        try {
            setIsLoading(true);
            let startDate = dates.start;
            let endDate = dates.end;

            if (filter !== 'custom') {
                const end = new Date();
                const start = new Date();
                const days = filter === '7_days' ? 7 : filter === '30_days' ? 30 : filter === '6_months' ? 180 : filter === '1_year' ? 365 : filter === '5_years' ? 1825 : 3650;
                start.setDate(end.getDate() - days);
                startDate = start.toISOString();
                endDate = end.toISOString();
            }

            const response = await axios.get(`${API_URL}/admin/reports?startDate=${startDate}&endDate=${endDate}`);
            if (response.data.success) {
                setReportData(response.data.data);
                setSummary(response.data.summary);
            }
        } catch (error) {
            console.error('Fetch report error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [filter, dates]);

    const downloadCSV = () => {
        const headers = ['Order ID', 'Customer Name', 'Amount', 'Date', 'Status', 'Payment'];
        const rows = reportData.map(o => [
            o.id,
            o.user_name,
            o.total_amount,
            new Date(o.created_at).toLocaleDateString(),
            o.order_status,
            o.payment_status
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(',') + "\n"
            + rows.map(r => r.join(',')).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Amstel_Riders_Report_${filter}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const stats = [
        { label: 'TOTAL SALES VOLUME', value: `₹${summary.totalSales.toLocaleString()}`, icon: TrendingUp },
        { label: 'REVENUE GENERATED', value: `₹${summary.revenue.toLocaleString()}`, icon: DollarSign },
        { label: 'TOTAL ORDER COUNT', value: summary.orderCount, icon: ShoppingBag },
    ];

    return (
        <AdminLayout>
            <div className="flex flex-col gap-12 pb-20">
                {/* Header & Filter Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">REPORTS <span className="text-secondary">& ARCHIVES</span></h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-2">DIVE DEEP INTO YOUR BUSINESS PERFORMANCE</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Filters Area */}
                    <div className="lg:w-80 flex flex-col gap-8">
                         <div className="flex flex-col gap-6 glass rounded-[32px] p-8 border border-white/5 bg-white/5 shadow-2xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic flex items-center gap-2">
                                <Filter size={14} className="text-secondary" /> RANGE FILTER
                            </h4>
                            <div className="flex flex-col gap-3">
                                {[
                                    { id: '7_days', name: 'LAST 7 DAYS' },
                                    { id: '30_days', name: 'LAST 30 DAYS' },
                                    { id: '6_months', name: 'LAST 6 MONTHS' },
                                    { id: '1_year', name: 'LAST 1 YEAR' },
                                    { id: '5_years', name: 'LAST 5 YEARS' },
                                    { id: '10_years', name: 'LAST 10 YEARS' },
                                    { id: 'custom', name: 'CUSTOM RANGE' },
                                ].map((opt) => (
                                    <button 
                                        key={opt.id} onClick={() => setFilter(opt.id)}
                                        className={`h-12 px-6 rounded-xl flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic transition-all ${filter === opt.id ? 'bg-secondary text-white shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                    >
                                        {opt.name} {filter === opt.id && <ArrowRight size={14} />}
                                    </button>
                                ))}
                            </div>
                         </div>

                         <AnimatePresence>
                             {filter === 'custom' && (
                                 <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-6 glass rounded-[32px] p-8 border border-white/5 bg-white/5 shadow-2xl"
                                 >
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">CUSTOM PERIOD</h4>
                                     <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">FROM DATE</span>
                                            <input 
                                                type="date" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })}
                                                className="bg-black/50 border border-white/5 rounded-xl h-12 px-4 text-[10px] font-black uppercase italic text-white focus:outline-none focus:border-secondary" 
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">TO DATE</span>
                                            <input 
                                                type="date" value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })}
                                                className="bg-black/50 border border-white/5 rounded-xl h-12 px-4 text-[10px] font-black uppercase italic text-white focus:outline-none focus:border-secondary" 
                                            />
                                        </div>
                                     </div>
                                 </motion.div>
                             )}
                         </AnimatePresence>
                    </div>

                    {/* Right: Data Area */}
                    <div className="flex-grow flex flex-col gap-8">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="glass rounded-[24px] p-8 border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{stat.label}</span>
                                        <span className="text-2xl font-black italic tracking-tighter text-white uppercase">{isLoading ? '...' : stat.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Report Log Display */}
                        <div className="glass rounded-[32px] border border-white/5 bg-white/5 shadow-2xl relative overflow-hidden">
                             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-black italic uppercase tracking-tighter text-white">GENERATED LOG ARCHIVE</h3>
                                <Button onClick={downloadCSV} variant="outline" size="sm" className="h-12 px-6 rounded-xl border-secondary/20 bg-secondary/5 text-secondary text-[10px] font-black italic tracking-widest">
                                    <Download size={16} className="mr-3" /> EXPORT TO CSV
                                </Button>
                             </div>
                             
                             <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="bg-black border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic">ORDER ID</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic">CUSTOMER</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic text-right">VOLUME</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic">STAMP</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic text-right">ACCESS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="animate-pulse opacity-20">
                                                    <td colSpan={5} className="px-8 py-6 h-20 bg-white/5 border-b border-white/5" />
                                                </tr>
                                            ))
                                        ) : reportData.map((order, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 text-[10px] font-black italic text-secondary">#{order.id.toString().slice(-6).toUpperCase()}</td>
                                                <td className="px-8 py-6 text-[10px] font-black uppercase text-white italic">{order.user_name}</td>
                                                <td className="px-8 py-6 text-[10px] font-black text-right text-white italic">₹{order.total_amount.toLocaleString()}</td>
                                                <td className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="text-white/20 hover:text-white transition-colors">
                                                        <FileText size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;
