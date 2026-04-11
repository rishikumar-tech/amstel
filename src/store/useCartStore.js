import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            
            addItem: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(item => item.id === product.id);
                
                // CRITICAL FIX: Robust image selection and stripping
                const fallbackImg = 'https://images.unsplash.com/photo-1558981403-c5f91eb9c08d?q=80&w=2070&auto=format&fit=crop';
                
                let cartImg = product.image_url;
                if (!cartImg && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
                    cartImg = product.image_urls[0];
                }

                const cleanItem = {
                    id: product.id,
                    name: product.name || `${product.brand} ${product.model_name}`,
                    price: Number(product.price),
                    quantity: 1,
                    image_url: cartImg || fallbackImg
                };

                // Filter out broken base64 or empty strings
                if (typeof cleanItem.image_url !== 'string' || cleanItem.image_url.startsWith('data:') || !cleanItem.image_url.trim()) {
                    cleanItem.image_url = fallbackImg;
                }

                try {
                    if (existingItem) {
                        set({
                            items: currentItems.map(item =>
                                item.id === product.id
                                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                                    : item
                        )
                        });
                    } else {
                        set({ items: [...currentItems, cleanItem] });
                    }
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        console.error('Cart full, clearing and retrying...');
                        localStorage.removeItem('amstel-riders-cart');
                        set({ items: [cleanItem] });
                    }
                }
            },
            
            removeItem: (productId) => {
                set({ items: get().items.filter(item => item.id !== productId) });
            },
            
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                });
            },
            
            clearCart: () => set({ items: [] }),
            
            getTotalAmount: () => {
                return get().items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
            }
        }),
        {
            name: 'amstel-riders-cart',
        }
    )
);

export default useCartStore;
