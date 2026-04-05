import React, { useState, useEffect } from 'react';
import {
    Plus, Box, Layers, Trash2, Camera, Edit2, X,
    ChevronDown, ChevronUp, PlusCircle, Save, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const BRANDS = ['AXOR', 'SMK', 'MT HELMETS', 'LS2', 'AGV', 'SHOEI', 'VEGA', 'STEELBIRD', 'STUDDS', 'WRANGLER'];

const emptyVariant = { id: null, color: '', price: '', compare_price: '', stock: '', image_urls: [''] };

// ── Inline field component ────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic ml-1">{label}</label>
        {children}
    </div>
);

const inputCls = "h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-[11px] font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all w-full";

// ─────────────────────────────────────────────────────────────────────────────

const Models = () => {
    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [variantsByModel, setVariantsByModel] = useState({});
    const [variantsLoading, setVariantsLoading] = useState({});

    // Model modal
    const [modelModal, setModelModal] = useState(false);
    const [modelForm, setModelForm] = useState({ name: '', brand: BRANDS[0] });
    const [editingModel, setEditingModel] = useState(null);
    const [modelSaving, setModelSaving] = useState(false);

    // Variant modal
    const [variantModal, setVariantModal] = useState(false);
    const [variantForm, setVariantForm] = useState(emptyVariant);
    const [activeModel, setActiveModel] = useState(null);
    const [variantSaving, setVariantSaving] = useState(false);

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchModels = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products/models`);
            if (res.data.success) setModels(res.data.models);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const fetchVariants = async (model) => {
        setVariantsLoading(p => ({ ...p, [model.id]: true }));
        try {
            const res = await axios.get(`${API_URL}/products/variants?brand=${model.brand}&model=${model.name}`);
            if (res.data.success)
                setVariantsByModel(p => ({ ...p, [model.id]: res.data.variants }));
        } catch (e) { console.error(e); }
        finally { setVariantsLoading(p => ({ ...p, [model.id]: false })); }
    };

    useEffect(() => { fetchModels(); }, []);

    // ── Toggle model row expand ───────────────────────────────────────────
    const toggleExpand = (model) => {
        if (expandedId === model.id) {
            setExpandedId(null);
        } else {
            setExpandedId(model.id);
            if (!variantsByModel[model.id]) fetchVariants(model);
        }
    };

    // ── Model CRUD ────────────────────────────────────────────────────────
    const openAddModel = () => {
        setEditingModel(null);
        setModelForm({ name: '', brand: BRANDS[0] });
        setModelModal(true);
    };
    const openEditModel = (m) => {
        setEditingModel(m);
        setModelForm({ name: m.name, brand: m.brand });
        setModelModal(true);
    };
    const handleSaveModel = async (e) => {
        e.preventDefault();
        setModelSaving(true);
        try {
            if (editingModel) {
                await axios.put(`${API_URL}/products/models/${editingModel.id}`, modelForm);
            } else {
                await axios.post(`${API_URL}/products/models`, modelForm);
            }
            fetchModels();
            setModelModal(false);
        } catch { alert('Failed to save model'); }
        finally { setModelSaving(false); }
    };
    const handleDeleteModel = async (m) => {
        if (!window.confirm(`DELETE model "${m.brand} – ${m.name}" and ALL its variants?`)) return;
        try {
            await axios.delete(`${API_URL}/products/models/${m.id}`);
            fetchModels();
            if (expandedId === m.id) setExpandedId(null);
        } catch { alert('Delete failed'); }
    };

    // ── Variant CRUD ──────────────────────────────────────────────────────
    const openAddVariant = (model) => {
        setActiveModel(model);
        setVariantForm(emptyVariant);
        setVariantModal(true);
    };
    const openEditVariant = (model, v) => {
        setActiveModel(model);
        setVariantForm({
            id: v.id,
            color: v.color,
            price: v.price,
            compare_price: v.compare_price || '',
            stock: v.stock,
            image_urls: Array.isArray(v.image_urls) && v.image_urls.length ? v.image_urls : ['']
        });
        setVariantModal(true);
    };
    const handleSaveVariant = async (e) => {
        e.preventDefault();
        setVariantSaving(true);
        try {
            const payload = {
                ...variantForm,
                image_urls: variantForm.image_urls.filter(u => u.trim()),
            };
            if (variantForm.id) {
                await axios.put(`${API_URL}/products/variants/${variantForm.id}`, payload);
            } else {
                await axios.post(`${API_URL}/products/variants`, {
                    model_id: activeModel.id,
                    brand: activeModel.brand,
                    model_name: activeModel.name,
                    ...payload
                });
            }
            fetchVariants(activeModel);
            fetchModels(); // update variant count
            setVariantModal(false);
        } catch { alert('Failed to save variant'); }
        finally { setVariantSaving(false); }
    };
    const handleDeleteVariant = async (model, vid) => {
        if (!window.confirm('DELETE this color variant?')) return;
        try {
            await axios.delete(`${API_URL}/products/variants/${vid}`);
            fetchVariants(model);
            fetchModels();
        } catch { alert('Delete failed'); }
    };

    const addImageUrl = () => {
        if (variantForm.image_urls.length < 5)
            setVariantForm(p => ({ ...p, image_urls: [...p.image_urls, ''] }));
    };
    const removeImageUrl = (i) => {
        const urls = variantForm.image_urls.filter((_, idx) => idx !== i);
        setVariantForm(p => ({ ...p, image_urls: urls.length ? urls : [''] }));
    };
    const setImageUrl = (i, val) => {
        const urls = [...variantForm.image_urls];
        urls[i] = val;
        setVariantForm(p => ({ ...p, image_urls: urls }));
    };

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 pb-10">

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                            MODELS <span className="text-secondary">&amp; COLORS</span>
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-1">
                            MANAGE PRODUCT FAMILIES AND COLOR VARIANTS
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchModels}
                            className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <Button
                            onClick={openAddModel}
                            className="h-11 px-6 rounded-xl italic font-black text-xs shadow-2xl whitespace-nowrap"
                        >
                            <Plus size={16} className="mr-2" /> NEW MODEL
                        </Button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Models', value: models.length },
                        { label: 'Brands',   value: [...new Set(models.map(m => m.brand))].length },
                        { label: 'Variants', value: models.reduce((a, m) => a + (m.variants_count || 0), 0) },
                        { label: 'In Stock', value: Object.values(variantsByModel).flat().filter(v => v.stock > 0).length },
                    ].map(({ label, value }) => (
                        <div key={label} className="glass rounded-xl p-4 border border-white/5">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{label}</p>
                            <p className="text-2xl font-black italic text-white mt-0.5">{value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Models List ── */}
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 glass rounded-2xl border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : models.length === 0 ? (
                    <div className="glass rounded-3xl p-16 border border-white/5 flex flex-col items-center text-center">
                        <Box size={48} className="text-white/5 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">NO MODELS YET — CREATE YOUR FIRST</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {models.map((model) => {
                            const isOpen = expandedId === model.id;
                            const variants = variantsByModel[model.id] || [];

                            return (
                                <motion.div
                                    key={model.id}
                                    layout
                                    className="glass rounded-2xl border border-white/5 overflow-hidden"
                                >
                                    {/* Model Row */}
                                    <div className="flex items-center gap-3 p-4 md:p-5">
                                        <button
                                            onClick={() => toggleExpand(model)}
                                            className="flex-1 flex items-center gap-4 text-left min-w-0"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                <Box size={18} className="text-secondary/70" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black italic uppercase tracking-tight text-white truncate">{model.name}</p>
                                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{model.brand} &bull; {model.variants_count || 0} COLORS</p>
                                            </div>
                                            <div className="ml-auto flex-shrink-0 text-white/30">
                                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </button>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => openAddVariant(model)}
                                                title="Add Color Variant"
                                                className="w-9 h-9 rounded-xl glass border-white/10 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary/30 transition-all"
                                            >
                                                <PlusCircle size={16} />
                                            </button>
                                            <button
                                                onClick={() => openEditModel(model)}
                                                title="Edit Model"
                                                className="w-9 h-9 rounded-xl glass border-white/10 flex items-center justify-center text-white/30 hover:text-secondary hover:border-secondary/30 transition-all"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteModel(model)}
                                                title="Delete Model"
                                                className="w-9 h-9 rounded-xl glass border-white/10 flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/30 transition-all"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Variants Panel */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-white/5 p-4 md:p-5">
                                                    {variantsLoading[model.id] ? (
                                                        <div className="flex items-center gap-3 py-4">
                                                            <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">LOADING VARIANTS...</span>
                                                        </div>
                                                    ) : variants.length === 0 ? (
                                                        <div className="py-6 flex flex-col items-center text-center gap-3">
                                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">NO COLOR VARIANTS YET</p>
                                                            <button
                                                                onClick={() => openAddVariant(model)}
                                                                className="text-[9px] font-black uppercase tracking-widest text-secondary hover:underline"
                                                            >
                                                                + ADD FIRST COLOR
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {variants.map((v) => (
                                                                <div
                                                                    key={v.id}
                                                                    className="flex items-center gap-3 bg-white/3 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all group"
                                                                >
                                                                    {/* Thumbnail */}
                                                                    <div className="w-14 h-14 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-white/10">
                                                                        {v.image_urls?.[0] ? (
                                                                            <img src={v.image_urls[0]} alt={v.color} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Camera size={20} />
                                                                        )}
                                                                    </div>
                                                                    {/* Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[10px] font-black italic uppercase text-white truncate">{v.color}</p>
                                                                        <p className="text-secondary text-[10px] font-black italic">₹{Number(v.price).toLocaleString()}</p>
                                                                        <p className="text-[8px] text-white/25 font-black uppercase tracking-widest">STOCK: {v.stock}</p>
                                                                    </div>
                                                                    {/* Actions */}
                                                                    <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => openEditVariant(model, v)}
                                                                            className="w-7 h-7 rounded-lg glass border-white/10 flex items-center justify-center text-white/30 hover:text-secondary hover:border-secondary/30 transition-all"
                                                                        >
                                                                            <Edit2 size={12} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteVariant(model, v.id)}
                                                                            className="w-7 h-7 rounded-lg glass border-white/10 flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/30 transition-all"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Add variant button */}
                                                            <button
                                                                onClick={() => openAddVariant(model)}
                                                                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 p-4 text-white/20 hover:text-white hover:border-white/30 transition-all text-[9px] font-black uppercase tracking-widest italic"
                                                            >
                                                                <Plus size={16} /> ADD COLOR
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Model Modal ── */}
            <Modal
                isOpen={modelModal}
                onClose={() => setModelModal(false)}
                title={editingModel ? 'EDIT MODEL' : 'ADD NEW MODEL'}
            >
                <form onSubmit={handleSaveModel} className="flex flex-col gap-6">
                    <Field label="Parent Brand">
                        <div className="relative">
                            <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                            <select
                                required value={modelForm.brand}
                                onChange={(e) => setModelForm(p => ({ ...p, brand: e.target.value }))}
                                className={`${inputCls} pl-10 appearance-none`}
                            >
                                {BRANDS.map(b => <option key={b} value={b} className="bg-[#0a0a0a]">{b}</option>)}
                            </select>
                        </div>
                    </Field>
                    <Field label="Model Name">
                        <div className="relative">
                            <Box size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                            <input
                                type="text" required value={modelForm.name}
                                onChange={(e) => setModelForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="EX: K1, APEX, THUNDER"
                                className={`${inputCls} pl-10`}
                            />
                        </div>
                    </Field>
                    <Button type="submit" size="lg" className="h-13 rounded-xl font-black italic shadow-2xl" disabled={modelSaving}>
                        {modelSaving
                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <><Save size={16} className="mr-2" />{editingModel ? 'UPDATE MODEL' : 'CREATE MODEL'}</>
                        }
                    </Button>
                </form>
            </Modal>

            {/* ── Variant Modal ── */}
            <Modal
                isOpen={variantModal}
                onClose={() => setVariantModal(false)}
                title={variantForm.id
                    ? `EDIT VARIANT — ${activeModel?.brand} ${activeModel?.name}`
                    : `ADD COLOR — ${activeModel?.brand} ${activeModel?.name}`
                }
            >
                <form onSubmit={handleSaveVariant} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Color Name">
                            <input
                                type="text" required value={variantForm.color}
                                onChange={(e) => setVariantForm(p => ({ ...p, color: e.target.value }))}
                                placeholder="EX: MATTE BLACK"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Price (₹)">
                            <input
                                type="number" required min="1" value={variantForm.price}
                                onChange={(e) => setVariantForm(p => ({ ...p, price: e.target.value }))}
                                placeholder="EX: 4999"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Compare Price (₹) — optional MRP">
                            <input
                                type="number" min="1" value={variantForm.compare_price}
                                onChange={(e) => setVariantForm(p => ({ ...p, compare_price: e.target.value }))}
                                placeholder="EX: 5999"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Stock Quantity">
                            <input
                                type="number" required min="0" value={variantForm.stock}
                                onChange={(e) => setVariantForm(p => ({ ...p, stock: e.target.value }))}
                                placeholder="EX: 50"
                                className={inputCls}
                            />
                        </Field>
                    </div>

                    {/* Image URLs */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic ml-1">
                                Product Images (max 5)
                            </label>
                            {variantForm.image_urls.length < 5 && (
                                <button
                                    type="button" onClick={addImageUrl}
                                    className="text-[9px] font-black uppercase tracking-widest text-secondary hover:underline"
                                >
                                    + ADD IMAGE
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            {variantForm.image_urls.map((url, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Camera size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                        <input
                                            type="url" value={url}
                                            onChange={(e) => setImageUrl(idx, e.target.value)}
                                            placeholder="https://images.example.com/..."
                                            className="h-10 w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 text-[9px] font-black italic text-white focus:outline-none focus:border-secondary transition-all"
                                        />
                                    </div>
                                    {variantForm.image_urls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageUrl(idx)}
                                            className="w-9 h-9 rounded-lg glass border-white/10 flex items-center justify-center text-white/20 hover:text-red-500 transition-colors flex-shrink-0"
                                        >
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="h-13 rounded-xl font-black italic shadow-2xl" disabled={variantSaving}>
                        {variantSaving
                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <><Save size={16} className="mr-2" />{variantForm.id ? 'UPDATE VARIANT' : 'SAVE VARIANT'}</>
                        }
                    </Button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Models;
