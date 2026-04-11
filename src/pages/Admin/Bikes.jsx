import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, RefreshCw, Navigation } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic ml-1">{label}</label>
        {children}
    </div>
);

const inputCls = "h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-[11px] font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all w-full";

const Bikes = () => {
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ id: null, name: '' });
    const [isSaving, setIsSaving] = useState(false);

    const fetchBikes = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/bikes`);
            if (res.data.success) {
                setBikes(res.data.bikes);
            }
        } catch (error) {
            console.error('Failed to load bikes', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBikes();
    }, []);

    const openAdd = () => {
        setForm({ id: null, name: '' });
        setModalOpen(true);
    };

    const openEdit = (bike) => {
        setForm({ id: bike.id, name: bike.name });
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setIsSaving(true);
        try {
            if (form.id) {
                await axios.put(`${API_URL}/bikes/${form.id}`, { name: form.name });
            } else {
                await axios.post(`${API_URL}/bikes`, { name: form.name });
            }
            fetchBikes();
            setModalOpen(false);
        } catch (error) {
            alert('Failed to save bike category');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete the bike category "${name}"?`)) return;
        try {
            await axios.delete(`${API_URL}/bikes/${id}`);
            fetchBikes();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                            BIKE <span className="text-secondary">CATEGORIES</span>
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-1">
                            MANAGE BIKE TAGS FOR PRODUCT MAPPING
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchBikes} className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                            <RefreshCw size={16} />
                        </button>
                        <Button onClick={openAdd} className="h-11 px-6 rounded-xl italic font-black text-xs shadow-2xl">
                            <Plus size={16} className="mr-2" /> NEW BIKE
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-3 mt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-16 glass rounded-2xl border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="glass rounded-3xl p-16 mt-6 border border-white/5 flex flex-col items-center text-center">
                        <Navigation size={48} className="text-white/5 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">NO BIKES FOUND — CREATE YOUR FIRST</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {bikes.map(bike => (
                            <div key={bike.id} className="glass rounded-2xl p-5 border border-white/5 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Navigation size={18} className="text-secondary/70" />
                                    </div>
                                    <div>
                                        <p className="font-black italic uppercase tracking-tight text-white">{bike.name}</p>
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-0.5">SLUG: {bike.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(bike)} className="w-8 h-8 rounded-lg glass border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                                        <Edit2 size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(bike.id, bike.name)} className="w-8 h-8 rounded-lg glass border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? 'EDIT BIKE' : 'ADD NEW BIKE'}>
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <Field label="Bike Name">
                        <div className="relative">
                            <Navigation size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="EX: R15, MT15, HUNTER 350"
                                className={`${inputCls} pl-10`}
                            />
                        </div>
                    </Field>
                    <Button type="submit" size="lg" className="h-13 rounded-xl font-black italic shadow-2xl" disabled={isSaving}>
                        {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                            <><Save size={16} className="mr-2" />{form.id ? 'UPDATE BIKE' : 'CREATE BIKE'}</>
                        )}
                    </Button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Bikes;
