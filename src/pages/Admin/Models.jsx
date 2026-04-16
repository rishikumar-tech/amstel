import React, { useState, useEffect } from 'react';
import {
    Plus, Box, Layers, Trash2, Camera, Edit2, X, Tag,
    ChevronDown, ChevronUp, PlusCircle, Save, RefreshCw, Info, Scale, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

const emptyVariant = { id: null, color: '', price: '', compare_price: '', stock: '', image_urls: [''] };

// ── Smart Compression Tiers ───────────────────────────────────────────────────
const TIER_THRESHOLDS = {
    SKIP: 150 * 1024,           // < 150 KB  → no compression at all
    LIGHT: 1 * 1024 * 1024,     // 150 KB – 1 MB → light compression
    // > 1 MB → moderate compression
};

const COMPRESSION_CONFIGS = {
    light: {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 2400,     // generous — won't resize most product images
        initialQuality: 0.92,       // near-lossless
        useWebWorker: true,
        preserveExif: false,        // strip EXIF to save bytes without any visual loss
        alwaysKeepResolution: true, // ← critical: disables spatial downscaling in tier 2
    },
    moderate: {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        initialQuality: 0.85,
        useWebWorker: true,
        preserveExif: false,
        alwaysKeepResolution: false,
    },
};

/**
 * smartCompress — Conditionally compresses an image based on its size.
 *
 * Tier 1 (<150 KB):   Skip entirely, return original File.
 * Tier 2 (150 KB–1 MB): Light compression, no spatial resize (alwaysKeepResolution).
 * Tier 3 (>1 MB):     Moderate compression with controlled resize.
 *
 * In all tiers, if the compressed output ends up larger than the original
 * (can happen with already-optimised PNGs), the original is returned.
 *
 * @param {File} file - The raw File object from the input
 * @returns {Promise<File>} - The processed File (may be the original)
 */
const smartCompress = async (file) => {
    const sizeKB = (file.size / 1024).toFixed(1);

    // Tier 1 — already small, zero quality loss risk
    if (file.size < TIER_THRESHOLDS.SKIP) {
        console.info(`[smartCompress] Tier 1 — ${sizeKB} KB → skipped`);
        return file;
    }

    // Tier 2 — light touch, preserve resolution
    if (file.size < TIER_THRESHOLDS.LIGHT) {
        console.info(`[smartCompress] Tier 2 — ${sizeKB} KB → light compression`);
        try {
            const compressed = await imageCompression(file, COMPRESSION_CONFIGS.light);
            // Revert if compression somehow made it larger (e.g. PNG → jpg on flat graphics)
            if (compressed.size >= file.size) {
                console.info(`[smartCompress] Compressed >= original, reverting`);
                return file;
            }
            return compressed;
        } catch (err) {
            console.warn('[smartCompress] Light compression failed, using original:', err);
            return file;
        }
    }

    // Tier 3 — moderate compression
    console.info(`[smartCompress] Tier 3 — ${sizeKB} KB → moderate compression`);
    try {
        const compressed = await imageCompression(file, COMPRESSION_CONFIGS.moderate);
        return compressed.size < file.size ? compressed : file;
    } catch (err) {
        console.warn('[smartCompress] Moderate compression failed, using original:', err);
        return file;
    }
};

// ── Shared UI primitives ──────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic ml-1">{label}</label>
        {children}
    </div>
);

const inputCls = "h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-[11px] font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all w-full";
const textareaCls = "bg-black/50 border border-white/10 rounded-xl p-4 text-[11px] font-black italic tracking-widest text-white uppercase placeholder:text-white/10 focus:outline-none focus:border-secondary transition-all w-full min-h-[100px] resize-none";

// ── Upload progress indicator ─────────────────────────────────────────────────
const UploadingBadge = ({ count }) => (
    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-secondary">
        <div className="w-3 h-3 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        UPLOADING {count > 1 ? `${count} IMAGES` : 'IMAGE'}...
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const Models = () => {
    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [variantsByModel, setVariantsByModel] = useState({});
    const [variantsLoading, setVariantsLoading] = useState({});

    // Model modal
    const [modelModal, setModelModal] = useState(false);
    const [modelForm, setModelForm] = useState({
        name: '', brand: '', category: 'Helmets', bike_tags: [],
        description: '', weight: '', delivery_rules: []
    });
    const [editingModel, setEditingModel] = useState(null);
    const [modelSaving, setModelSaving] = useState(false);

    // Variant modal
    const [variantModal, setVariantModal] = useState(false);
    const [variantForm, setVariantForm] = useState(emptyVariant);
    const [activeModel, setActiveModel] = useState(null);
    const [variantSaving, setVariantSaving] = useState(false);

    // Upload state
    const [uploadingCount, setUploadingCount] = useState(0);

    // Data
    const [allBikes, setAllBikes] = useState([]);
    const [fetchedBrands, setFetchedBrands] = useState([]);
    const [fetchedCategories, setFetchedCategories] = useState([]);

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchModels = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products/models`);
            if (res.data.success) setModels(res.data.models);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const fetchBikes = async () => {
        try {
            const res = await axios.get(`${API_URL}/bikes`);
            if (res.data.success) setAllBikes(res.data.bikes);
        } catch (e) { console.error(e); }
    };

    const fetchAdminData = async () => {
        try {
            const [bRes, cRes] = await Promise.all([
                axios.get(`${API_URL}/admin/brands`),
                axios.get(`${API_URL}/admin/categories`)
            ]);
            if (bRes.data.success) setFetchedBrands(bRes.data.brands);
            if (cRes.data.success) setFetchedCategories(cRes.data.categories);
        } catch (e) { console.error(e); }
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

    useEffect(() => {
        fetchModels();
        fetchBikes();
        fetchAdminData();
    }, []);

    // ── Toggle expand ─────────────────────────────────────────────────────
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
        setModelForm({ name: '', brand: '', category: 'Helmets', bike_tags: [], description: '', weight: '', delivery_rules: [] });
        setModelModal(true);
    };

    const openEditModel = (m) => {
        setEditingModel(m);
        setModelForm({
            name: m.name,
            brand: m.brand,
            category: m.category || 'Helmets',
            bike_tags: m.bike_tags || [],
            description: m.description || '',
            weight: m.weight || '',
            delivery_rules: m.delivery_rules || []
        });
        setModelModal(true);
    };

    const handleSaveModel = async (e) => {
        e.preventDefault();
        if (!modelForm.name.trim() || !modelForm.brand.trim()) {
            alert('NAME AND BRAND ARE REQUIRED FIELDS');
            return;
        }
        setModelSaving(true);
        try {
            const brandExists = fetchedBrands.some(b => b.name.toLowerCase() === modelForm.brand.toLowerCase());
            if (modelForm.brand && !brandExists) {
                try {
                    await axios.post(`${API_URL}/admin/brands`, { name: modelForm.brand });
                    fetchAdminData();
                } catch (brandErr) {
                    console.warn('⚠️ Brand auto-creation failed:', brandErr);
                }
            }

            const payload = {
                ...modelForm,
                name: modelForm.name.trim(),
                brand: modelForm.brand.trim(),
                weight: modelForm.weight ? Number(modelForm.weight) : 0,
                delivery_rules: Array.isArray(modelForm.delivery_rules) ? modelForm.delivery_rules : []
            };

            let response;
            if (editingModel) {
                response = await axios.put(`${API_URL}/products/models/${editingModel.id}`, payload);
            } else {
                response = await axios.post(`${API_URL}/products/models`, payload);
            }

            if (response.data.success) {
                fetchModels();
                setModelModal(false);
                if (response.data.warning) console.warn('Model saved with warning:', response.data.warning);
            }
        } catch (err) {
            console.error('Model save error:', err);
            const errMsg = err.response?.data?.message || err.response?.data?.details || err.message;
            alert(`FAILED TO SAVE MODEL: ${errMsg}`);
        } finally {
            setModelSaving(false);
        }
    };

    const handleDeleteModel = async (m) => {
        if (!window.confirm(`DELETE model "${m.brand} – ${m.name}" and ALL its variants?`)) return;
        try {
            await axios.delete(`${API_URL}/products/models/${m.id}`);
            fetchModels();
            if (expandedId === m.id) setExpandedId(null);
        } catch { alert('Delete failed'); }
    };

    // ── Delivery rule helpers ─────────────────────────────────────────────
    const addDeliveryRule = () => {
        setModelForm(p => ({ ...p, delivery_rules: [...p.delivery_rules, { min: '', max: '', charge: '' }] }));
    };
    const removeDeliveryRule = (idx) => {
        setModelForm(p => ({ ...p, delivery_rules: p.delivery_rules.filter((_, i) => i !== idx) }));
    };
    const updateDeliveryRule = (idx, field, val) => {
        const rules = [...modelForm.delivery_rules];
        rules[idx][field] = val;
        setModelForm(p => ({ ...p, delivery_rules: rules }));
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
            const { id, ...payloadWithoutId } = variantForm;
            const payload = {
                ...payloadWithoutId,
                image_urls: variantForm.image_urls.filter(u => u.trim()),
                price: Number(variantForm.price),
                compare_price: variantForm.compare_price ? Number(variantForm.compare_price) : null,
                stock: Number(variantForm.stock)
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
            fetchModels();
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

    // ── Image URL helpers ─────────────────────────────────────────────────
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

    // ── Image upload handler (with smart compression inline) ──────────────
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Cap at 5 total images
        const existingCount = variantForm.image_urls.filter(u => u.trim()).length;
        const canUpload = Math.min(files.length, 5 - existingCount);
        if (canUpload <= 0) {
            alert('MAXIMUM 5 IMAGES ALLOWED');
            e.target.value = '';
            return;
        }

        const filesToProcess = files.slice(0, canUpload);
        setUploadingCount(filesToProcess.length);

        for (const file of filesToProcess) {
            try {
                // ── Step 1: Smart conditional compression ──────────────────
                const processedFile = await smartCompress(file);

                // ── Step 2: Convert to base64 ──────────────────────────────
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (re) => resolve(re.target.result);
                    reader.onerror = () => reject(new Error('File read failed'));
                    reader.readAsDataURL(processedFile);
                });

                // ── Step 3: Upload to server ───────────────────────────────
                const res = await axios.post(`${API_URL}/admin/upload`, { image: base64 });

                if (res.data.success) {
                    setVariantForm(prev => ({
                        ...prev,
                        image_urls: [
                            ...prev.image_urls.filter(u => u.trim()),
                            res.data.url,
                        ].slice(0, 5),
                    }));
                }
            } catch (err) {
                console.error('Upload failed:', err);
                const errMsg = err.response?.data?.message || 'IMAGE UPLOAD FAILED. PLEASE CHECK STORAGE CONFIG.';
                alert(errMsg);
            } finally {
                setUploadingCount(prev => Math.max(0, prev - 1));
            }
        }

        e.target.value = ''; // reset so same file can be re-selected
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
                        { label: 'Brands', value: [...new Set(models.map(m => m.brand))].length },
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                            NO MODELS YET — CREATE YOUR FIRST
                        </p>
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
                                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                    {model.brand} &bull; {model.category}
                                                    {model.variants_count > 0 && (
                                                        <span className="ml-2 text-secondary/60">{model.variants_count} COLOR{model.variants_count !== 1 ? 'S' : ''}</span>
                                                    )}
                                                </p>
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
                                                                        {v.compare_price && (
                                                                            <p className="text-[8px] text-white/25 font-black uppercase line-through">₹{Number(v.compare_price).toLocaleString()}</p>
                                                                        )}
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

                                                            {/* Add variant tile */}
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

            {/* ════════════════════════════════════════════════
                ── Model Modal
            ════════════════════════════════════════════════ */}
            <Modal
                isOpen={modelModal}
                onClose={() => setModelModal(false)}
                title={editingModel ? 'EDIT MODEL' : 'ADD NEW MODEL'}
                maxWidth="max-w-4xl"
            >
                <form onSubmit={handleSaveModel} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto no-scrollbar pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Brand */}
                        <Field label="Parent Brand (type to search or add)">
                            <div className="relative">
                                <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                <input
                                    list="brand-list"
                                    required
                                    value={modelForm.brand}
                                    onChange={(e) => setModelForm(p => ({ ...p, brand: e.target.value }))}
                                    placeholder="EX: AXOR"
                                    className={`${inputCls} pl-10`}
                                />
                                <datalist id="brand-list">
                                    {fetchedBrands.map(b => <option key={b.id} value={b.name} />)}
                                </datalist>
                            </div>
                        </Field>

                        {/* Category */}
                        <Field label="Category">
                            <div className="relative">
                                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                <select
                                    required
                                    value={modelForm.category}
                                    onChange={(e) => setModelForm(p => ({ ...p, category: e.target.value }))}
                                    className={`${inputCls} pl-10 appearance-none`}
                                >
                                    <option value="">SELECT CATEGORY</option>
                                    {fetchedCategories.map(c => (
                                        <option key={c.id} value={c.name} className="bg-[#0a0a0a]">{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </Field>

                        {/* Model Name */}
                        <Field label="Model Name">
                            <div className="relative">
                                <Box size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    value={modelForm.name}
                                    onChange={(e) => setModelForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="EX: K1, APEX, THUNDER"
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        {/* Weight — accessories only */}
                        {modelForm.category === 'Accessories' && (
                            <Field label="Weight (in kg)">
                                <div className="relative">
                                    <Scale size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={modelForm.weight}
                                        onChange={(e) => setModelForm(p => ({ ...p, weight: e.target.value }))}
                                        placeholder="EX: 0.5"
                                        className={`${inputCls} pl-10`}
                                    />
                                </div>
                            </Field>
                        )}
                    </div>

                    {/* Description */}
                    <Field label="Product Description (dynamic)">
                        <div className="relative">
                            <Info size={16} className="absolute left-4 top-5 text-white/20 pointer-events-none" />
                            <textarea
                                value={modelForm.description}
                                onChange={(e) => setModelForm(p => ({ ...p, description: e.target.value }))}
                                placeholder="ENTER DETAILED PRODUCT DESCRIPTION..."
                                className={`${textareaCls} pl-10`}
                            />
                        </div>
                    </Field>

                    {/* Bike Mapping */}
                    <Field label="Bike Mapping (optional)">
                        <div className="flex flex-wrap gap-2 pt-1 border border-white/10 rounded-xl p-3 bg-black/50 min-h-[52px]">
                            {allBikes.length === 0 ? (
                                <span className="text-[9px] font-black italic text-white/30 tracking-widest uppercase self-center">No bikes found.</span>
                            ) : (
                                allBikes.map(bike => {
                                    const isSelected = modelForm.bike_tags.includes(bike.name);
                                    return (
                                        <button
                                            key={bike.id}
                                            type="button"
                                            onClick={() => {
                                                const tags = isSelected
                                                    ? modelForm.bike_tags.filter(t => t !== bike.name)
                                                    : [...modelForm.bike_tags, bike.name];
                                                setModelForm(p => ({ ...p, bike_tags: tags }));
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isSelected
                                                    ? 'bg-secondary text-white'
                                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {bike.name}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </Field>

                    {/* Weight-Based Delivery Slabs — accessories only */}
                    {modelForm.category === 'Accessories' && (
                        <div className="flex flex-col gap-4 p-5 glass rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary italic flex items-center gap-2">
                                    <Truck size={14} /> WEIGHT-BASED DELIVERY CONFIG
                                </h3>
                                <button
                                    type="button"
                                    onClick={addDeliveryRule}
                                    className="text-[9px] font-black uppercase tracking-widest text-secondary hover:underline"
                                >
                                    + ADD SLAB
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {modelForm.delivery_rules.map((rule, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                                        <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                                            <input
                                                type="number"
                                                placeholder="FROM (KG)"
                                                value={rule.min}
                                                onChange={(e) => updateDeliveryRule(idx, 'min', e.target.value)}
                                                className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-[10px] font-black text-white italic"
                                            />
                                            <input
                                                type="number"
                                                placeholder="TO (KG)"
                                                value={rule.max}
                                                onChange={(e) => updateDeliveryRule(idx, 'max', e.target.value)}
                                                className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-[10px] font-black text-white italic"
                                            />
                                            <input
                                                type="number"
                                                placeholder="CHARGE (₹)"
                                                value={rule.charge}
                                                onChange={(e) => updateDeliveryRule(idx, 'charge', e.target.value)}
                                                className="h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-[10px] font-black text-white italic"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDeliveryRule(idx)}
                                            className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {modelForm.delivery_rules.length === 0 && (
                                    <p className="text-[9px] font-black text-white/20 text-center italic py-2 uppercase tracking-widest">
                                        No special weight rules defined. Using default pricing.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        className="h-14 rounded-xl font-black italic shadow-2xl mt-4"
                        disabled={modelSaving}
                    >
                        {modelSaving
                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <><Save size={16} className="mr-2" />{editingModel ? 'UPDATE MODEL' : 'CREATE MODEL'}</>
                        }
                    </Button>
                </form>
            </Modal>

            {/* ════════════════════════════════════════════════
                ── Variant Modal
            ════════════════════════════════════════════════ */}
            <Modal
                isOpen={variantModal}
                onClose={() => setVariantModal(false)}
                title={variantForm.id
                    ? `EDIT VARIANT — ${activeModel?.brand} ${activeModel?.name}`
                    : `ADD COLOR — ${activeModel?.brand} ${activeModel?.name}`
                }
            >
                <form onSubmit={handleSaveVariant} className="flex flex-col gap-5">

                    {/* Core fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Color Name">
                            <input
                                type="text"
                                required
                                value={variantForm.color}
                                onChange={(e) => setVariantForm(p => ({ ...p, color: e.target.value }))}
                                placeholder="EX: MATTE BLACK"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Price (₹)">
                            <input
                                type="number"
                                required
                                min="1"
                                value={variantForm.price}
                                onChange={(e) => setVariantForm(p => ({ ...p, price: e.target.value }))}
                                placeholder="EX: 4999"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Compare Price (₹) — optional MRP">
                            <input
                                type="number"
                                min="1"
                                value={variantForm.compare_price}
                                onChange={(e) => setVariantForm(p => ({ ...p, compare_price: e.target.value }))}
                                placeholder="EX: 5999"
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Stock Quantity">
                            <input
                                type="number"
                                required
                                min="0"
                                value={variantForm.stock}
                                onChange={(e) => setVariantForm(p => ({ ...p, stock: e.target.value }))}
                                placeholder="EX: 50"
                                className={inputCls}
                            />
                        </Field>
                    </div>

                    {/* ── Image section ── */}
                    <div className="flex flex-col gap-2">
                        {/* Header row */}
                        <div className="flex items-center justify-between">
                            <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 italic ml-1">
                                Product Images (max 5)
                            </label>

                            {uploadingCount > 0 ? (
                                <UploadingBadge count={uploadingCount} />
                            ) : variantForm.image_urls.filter(u => u.trim()).length < 5 && (
                                <div className="flex items-center gap-4">
                                    {/* ── File upload button ── */}
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpg,image/jpg,image/webp"
                                        id="variant-image-upload"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <label
                                        htmlFor="variant-image-upload"
                                        className="text-[9px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
                                    >
                                        + UPLOAD IMAGE
                                    </label>

                                    {/* ── Manual URL button ── */}
                                    <button
                                        type="button"
                                        onClick={addImageUrl}
                                        className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                                    >
                                        + ADD URL
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Image preview thumbnails (uploaded images) */}
                        {variantForm.image_urls.some(u => u.trim()) && (
                            <div className="flex gap-2 flex-wrap mb-1">
                                {variantForm.image_urls.filter(u => u.trim()).map((url, idx) => (
                                    <div key={url + idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-black/50 flex-shrink-0">
                                        <img
                                            src={url}
                                            alt={`Product image ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        {idx === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 text-white text-[7px] font-black text-center py-0.5 uppercase tracking-widest">
                                                MAIN
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* URL input fields */}
                        <div className="flex flex-col gap-2">
                            {variantForm.image_urls.map((url, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Camera size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                        <input
                                            type="url"
                                            value={url}
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

                        {/* Compression tier info */}
                        <p className="text-[8px] font-black text-white/15 uppercase tracking-widest italic ml-1 mt-1">
                            Images under 150 KB are uploaded as-is · larger files are lightly compressed
                        </p>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="h-13 rounded-xl font-black italic shadow-2xl"
                        disabled={variantSaving || uploadingCount > 0}
                    >
                        {variantSaving
                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : uploadingCount > 0
                                ? <span className="text-white/50">WAIT FOR UPLOADS TO FINISH...</span>
                                : <><Save size={16} className="mr-2" />{variantForm.id ? 'UPDATE VARIANT' : 'SAVE VARIANT'}</>
                        }
                    </Button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Models;