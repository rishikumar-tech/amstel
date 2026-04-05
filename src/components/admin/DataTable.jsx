import React from 'react';
import { Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ 
    columns, 
    data, 
    isLoading, 
    onEdit, 
    onDelete, 
    onView,
    pagination = { page: 1, pages: 1 }
}) => {
    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 w-full glass rounded-xl border-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="glass rounded-[32px] overflow-hidden border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-[#0a0a0a] border-b border-white/5">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                    {col.label}
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 italic text-right">
                                    ACTIONS
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                {columns.map((col, j) => (
                                    <td key={j} className="px-8 py-6 text-xs font-black uppercase text-white italic">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete || onView) && (
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            {onView && (
                                                <button 
                                                    onClick={() => onView(row)}
                                                    className="w-10 h-10 rounded-xl glass border-white/5 text-white/30 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button 
                                                    onClick={() => onEdit(row)}
                                                    className="w-10 h-10 rounded-xl glass border-white/5 text-white/30 hover:text-secondary hover:border-secondary/20 transition-all flex items-center justify-center"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button 
                                                    onClick={() => onDelete(row)}
                                                    className="w-10 h-10 rounded-xl glass border-white/5 text-white/30 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-6 py-4">
                    <button className="w-12 h-12 rounded-xl glass border-white/5 text-white/30 hover:text-white transition-all flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-[10px] font-black italic uppercase tracking-widest text-white/40">
                        PAGE <span className="text-white">{pagination.page}</span> OF <span className="text-white">{pagination.pages}</span>
                    </span>
                    <button className="w-12 h-12 rounded-xl glass border-white/5 text-white/30 hover:text-white transition-all flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none">
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
