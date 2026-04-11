import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Tag, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

    const fetchBrands = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/brands`);
            if (res.data.success) setBrands(res.data.brands);
        } catch (e) {
            console.error('Failed to load brands', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const columns = [
        { key: 'name', label: 'BRAND NAME' },
        { key: 'created_at', label: 'ADDED ON' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                // To keep it minimal, we assume put is not needed yet since user only mentioned add/persist
                // but let's at least ensure add works
            } else {
                await axios.post(`${API_URL}/admin/brands`, { name: formData.name });
            }
            fetchBrands();
            setIsModalOpen(false);
            setEditData(null);
            setFormData({ name: '' });
        } catch (e) {
            alert('Failed to save brand');
        }
    };

    const handleEdit = (brand) => {
        setEditData(brand);
        setFormData({ name: brand.name });
        setIsModalOpen(true);
    };

    const handleDelete = async (brand) => {
        if (!window.confirm(`DELETE ${brand.name}? THIS CANNOT BE UNDONE.`)) return;
        try {
            await axios.delete(`${API_URL}/admin/brands/${brand.id}`);
            fetchBrands();
        } catch (e) {
            alert('Delete failed');
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">BRAND <span className="text-secondary">MANAGEMENT</span></h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-2">CONFIGURE AUTHORIZED MANUFACTURERS</p>
                    </div>
                    <Button onClick={() => { setEditData(null); setFormData({ name: '' }); setIsModalOpen(true); }} size="lg" className="h-16 px-10 rounded-2xl italic font-black shadow-2xl">
                        <Plus size={20} className="mr-3" /> ADD NEW BRAND
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={brands}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editData ? 'EDIT BRAND' : 'CREATE BRAND'}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic ml-1">OFFICIAL NAME</label>
                            <div className="relative group">
                                <Tag size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" />
                                <input
                                    type="text" required value={formData.name} onChange={(e) => setFormData({ name: e.target.value })}
                                    placeholder="EX: AXOR HELMETS"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 pl-16 pr-6 text-xs font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" size="lg" className="flex-1 h-16 rounded-2xl font-black italic shadow-2xl">
                                {editData ? 'UPDATE BRAND' : 'INITIALIZE BRAND'}
                            </Button>
                            <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-black italic border-white/5 bg-white/5">
                                CANCEL
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default Brands;
