import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Package, Clock, Phone, MapPin, CreditCard, ChevronRight, CheckCircle2, Truck, CheckCircle, Ruler } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://amstel-server.onrender.com/api';

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/orders`);
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Fetch orders error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        { key: 'id', label: 'ORDER ID', render: (row) => <span className="text-secondary font-black">#{row.id.toString().slice(-6).toUpperCase()}</span> },
        { key: 'user_name', label: 'CUSTOMER' },
        { key: 'total_amount', label: 'AMOUNT', render: (row) => <span>₹{row.total_amount.toLocaleString()}</span> },
        {
            key: 'payment_status', label: 'PAYMENT', render: (row) => (
                <Badge variant={row.payment_status === 'SUCCESS' ? 'success' : row.payment_status === 'PENDING' ? 'info' : 'danger'} size="sm">
                    {row.payment_status}
                </Badge>
            )
        },
        {
            key: 'order_status', label: 'ORDER STATUS', render: (row) => (
                <Badge variant={row.order_status === 'DELIVERED' ? 'success' : row.order_status === 'CANCELLED' ? 'danger' : 'info'} size="sm">
                    {row.order_status || 'PENDING'}
                </Badge>
            )
        },
    ];

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const updateStatus = async (status) => {
        try {
            const response = await axios.patch(`${API_URL}/orders/${selectedOrder.id}/status`, { status });
            if (response.data.success) {
                setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, order_status: status } : o));
                setSelectedOrder({ ...selectedOrder, order_status: status });
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Failed to update status');
        }
    };

    const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = steps.indexOf(selectedOrder?.order_status || 'PENDING');

    return (
        <AdminLayout>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">ORDER <span className="text-secondary">MANAGEMENT</span></h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-2">TRACK TRANSACTIONS AND FULFILLMENT STATUS</p>
                    </div>
                    <Button onClick={fetchOrders} variant="outline" size="sm" className="h-12 px-6 rounded-xl border-white/5 bg-white/5 font-black italic text-xs">
                        REFRESH ORDERS
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={orders}
                    isLoading={isLoading}
                    onView={handleViewOrder}
                />

                <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title={`ORDER DETAILS / ${selectedOrder?.id?.toString().slice(-6).toUpperCase()}`}>
                    <div className="flex flex-col gap-12">
                        {/* Order Status Timeline */}
                        <div className="flex justify-between items-center py-6 border-b border-t border-white/5 relative">
                            {steps.map((step, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${i <= currentStatusIndex ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20 scale-110 font-bold' : 'bg-[#0a0a0a] border-white/10 text-white/20'}`}>
                                        {i < currentStatusIndex ? <CheckCircle size={16} /> : i === currentStatusIndex ? <Clock size={16} /> : <Package size={16} />}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest italic ${i <= currentStatusIndex ? 'text-white' : 'text-white/20'}`}>{step}</span>
                                </div>
                            ))}
                            <div className="absolute top-11 left-[10%] right-[10%] h-px bg-white/5 -z-0" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Customer Info */}
                            <div className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic mb-2">SHIPPING INFO</h4>
                                <div className="glass rounded-[24px] p-8 border border-white/5 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Phone size={18} className="text-white/20 mt-1" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-white/30 uppercase italic">MOBILE NUMBER</span>
                                            <span className="text-sm font-black italic text-white uppercase tracking-tighter mt-1">{selectedOrder?.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <MapPin size={18} className="text-white/20 mt-1" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-white/30 uppercase italic">DELIVERY ADDRESS</span>
                                            <span className="text-sm font-black italic text-white uppercase tracking-tighter mt-1 leading-relaxed">
                                                {selectedOrder?.address}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedOrder?.size && (
                                        <div className="flex items-start gap-4">
                                            <Ruler size={18} className="text-white/20 mt-1" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-white/30 uppercase italic">SIZE</span>
                                                <span className="text-sm font-black italic text-white uppercase tracking-tighter mt-1">{selectedOrder.size}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic mb-2">PAYMENT DETAILS</h4>
                                <div className="glass rounded-[24px] p-8 border border-white/5 bg-gradient-to-tr from-primary/5 to-transparent">
                                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-white/30 uppercase italic">PHONEPE TRANSACTION</span>
                                                <span className="text-xs font-black italic text-white uppercase tracking-widest mt-1">{selectedOrder?.transaction_id || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <Badge variant={selectedOrder?.payment_status === 'SUCCESS' ? 'success' : 'info'} size="sm">{selectedOrder?.payment_status}</Badge>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-white/30 uppercase italic leading-none mb-2">AMOUNT PAID</span>
                                            <span className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">₹{selectedOrder?.total_amount?.toLocaleString()}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-white/20 tracking-tighter italic italic">PLACED ON {new Date(selectedOrder?.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic px-2">ORDER ITEMS</h4>
                            <div className="glass rounded-[24px] border border-white/5 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#0a0a0a] border-b border-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4 italic">PRODUCT</th>
                                            <th className="px-8 py-4 italic">QTY</th>
                                            <th className="px-8 py-4 italic">SIZE</th>
                                            <th className="px-8 py-4 italic text-right">PRICE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[10px] font-black italic text-white uppercase">
                                        {selectedOrder?.items && JSON.parse(selectedOrder.items).map((item, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6">{item.name}</td>
                                                <td className="px-8 py-6">{item.quantity}</td>
                                                <td className="px-8 py-6">{item.size || '-'}</td>
                                                <td className="px-8 py-6 text-right">₹{item.price.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Status Update Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-4 pt-6 border-t border-white/5">
                            <div className="flex-grow flex items-center gap-3 w-full">
                                <span className="text-[10px] font-black uppercase text-white/30 italic whitespace-nowrap">SET STATUS:</span>
                                <select
                                    value={selectedOrder?.order_status || 'PENDING'}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    className="flex-grow bg-white/5 border border-white/10 rounded-xl h-14 px-4 text-xs font-black italic tracking-widest text-white uppercase focus:outline-none focus:border-secondary transition-all appearance-none"
                                >
                                    {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                        <option key={s} value={s} className="bg-black">{s}</option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                onClick={() => updateStatus('DELIVERED')}
                                disabled={selectedOrder?.order_status === 'DELIVERED'}
                                className="w-full md:w-auto h-14 px-10 rounded-xl italic font-black bg-secondary hover:bg-secondary/80 text-white"
                            >
                                <CheckCircle2 size={18} className="mr-3" /> MARK AS DELIVERED
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default Orders;
