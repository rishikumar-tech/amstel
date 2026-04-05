import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className="flex items-center gap-4 p-4 glass rounded-2xl border-white/5 bg-white/5">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow min-w-0">
                <h4 className="text-sm font-black italic uppercase tracking-tighter text-white line-clamp-1 truncate">{item.name}</h4>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{item.brand}</p>
                <div className="text-base font-black text-white italic">₹{item.price.toLocaleString()}</div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center glass rounded-lg border-white/10 overflow-hidden">
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white/10 transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="px-3 text-xs font-black italic">{item.quantity}</span>
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white/10 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <button 
                    onClick={() => removeItem(item.id)}
                    className="text-white/30 hover:text-secondary transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
