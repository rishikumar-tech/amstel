import React, { useState, useEffect } from 'react';
import { Mail, Phone, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchEnquiries = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/admin/enquiries`);
            if (response.data.success) {
                setEnquiries(response.data.enquiries);
            }
        } catch (error) {
            console.error('Fetch enquiries error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const columns = [
        { key: 'created_at', label: 'DATE', render: (row) => <span className="text-[10px] text-white/30">{new Date(row.created_at).toLocaleDateString()}</span> },
        { key: 'name', label: 'CUSTOMER NAME' },
        { key: 'email', label: 'EMAIL', render: (row) => <a href={`mailto:${row.email}`} className="text-primary lowercase underline">{row.email}</a> },
        { key: 'phone', label: 'MOBILE NO', render: (row) => <a href={`tel:${row.phone}`} className="text-secondary">{row.phone}</a> },
        { key: 'message', label: 'MESSAGE / INQUIRY', render: (row) => <span className="line-clamp-1 max-w-[200px] text-white/50">{row.message}</span> },
    ];

    const handleDelete = async (row) => {
        if (!window.confirm('PERMANENTLY DELETE THIS ENQUIRY?')) return;
        try {
             // For now, endpoint not implemented, just filter locally or alert
             alert('ENQUIRY ARCHIVED (ENDPOINT IN DEVELOPMENT)');
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewEnquiry = (enquiry) => {
        alert(`FROM: ${enquiry.name}\n\nMESSAGE: ${enquiry.message}`);
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">RECEPTIONS <span className="text-secondary">& ENQUIRIES</span></h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-2">MANAGE CUSTOMER CONSULTATIONS AND LEADS</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                     <div className="glass p-6 rounded-2xl border-white/5 bg-white/5 flex flex-col gap-2">
                         <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">TOTAL LEADS</span>
                         <span className="text-2xl font-black italic text-white uppercase">{enquiries.length}</span>
                     </div>
                     <div className="glass p-6 rounded-2xl border-white/5 bg-white/5 flex flex-col gap-2">
                         <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">UNREAD STREAM</span>
                         <span className="text-2xl font-black italic text-secondary uppercase">ACTIVE</span>
                     </div>
                </div>

                <DataTable 
                    columns={columns} 
                    data={enquiries} 
                    isLoading={isLoading}
                    onView={handleViewEnquiry}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default Enquiries;
