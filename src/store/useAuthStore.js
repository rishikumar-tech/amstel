import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('admin_token') || null,
    isAuthenticated: !!localStorage.getItem('admin_token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('admin_token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'LOGIN FAILED', 
                isLoading: false,
                isAuthenticated: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('admin_token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
            // Optional: Call verify endpoint to check token validity
            const response = await axios.get('/api/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                set({ user: response.data.user, isAuthenticated: true });
            }
        } catch (error) {
            get().logout();
        }
    }
}));

export default useAuthStore;
