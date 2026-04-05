import React, { useState } from 'react';
import { Users, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Customers = () => {
    const [customers] = useState([
        { id: 1, name: 'Mahesh Kumar', email: 'mahesh@example.com', phone: '9876543210', orders: 12, spent: '₹45,000', joined: '2024-01-12' },
        { id: 2, name: 'Rohan Sharma', email: 'rohan@example.com', phone: '9876543211', orders: 5, spent: '₹12,499', joined: '2024-02-18' },
        { id: 3, name: 'Sneha Rao', email: 'sneha@example.com', phone: '9876543212', orders: 8, spent: '₹22,999', joined: '2024-03-01' },
        { id: 4, name: 'Amit Patel', email: 'amit@example.com', phone: '9876543213', orders: 2, spent: '₹5,500', joined: '2024-03-20' },
    ]);

    const columns = [
        { key: 'name', label: 'CUSTOMER NAME' },
        { key: 'email', label: 'EMAIL / CONTACT', render: (row) => (
            <div className="flex flex-col">
                <span className="text-xs font-black italic text-white uppercase truncate max-w-[150px]">{row.email}</span>
                <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">{row.phone}</span>
            </div>
        )},
        { key: 'orders', label: 'TOTAL ORDERS' },
        { key: 'spent', label: 'TOTAL SPENT', render: (row) => (
            <span className="text-sm font-black italic text-primary uppercase">{row.spent}</span>
        )},
        { key: 'joined', label: 'JOINED DATE' },
    ];

    return (
        <AdminLayout>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">CUSTOMER <span className="text-secondary">INDEX</span></h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mt-2">MANAGE USER ACCOUNTS AND PURCHASE HISTORY</p>
                    </div>
                </div>

                <DataTable 
                    columns={columns} 
                    data={customers} 
                    onView={() => {}} 
                />
            </div>
        </AdminLayout>
    );
};

export default Customers;
