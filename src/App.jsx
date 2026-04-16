import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Client pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Contact from './pages/Contact';
import Footer from './components/common/Footer';

// Policy pages
import DeliveryReturns from './pages/Policies/DeliveryReturns';
import RefundPolicy from './pages/Policies/RefundPolicy';
import PrivacyPolicy from './pages/Policies/PrivacyPolicy';
import TermsOfService from './pages/Policies/TermsOfService';
import ShippingPolicy from './pages/Policies/ShippingPolicy';

// Admin pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminBrands from './pages/Admin/Brands';
import AdminModels from './pages/Admin/Models';
import AdminOrders from './pages/Admin/Orders';
import AdminReports from './pages/Admin/Reports';
import AdminCoupons from './pages/Admin/Coupons';
import AdminEnquiries from './pages/Admin/Enquiries';
import AdminBikes from './pages/Admin/Bikes';
import AdminReviews from './pages/Admin/Reviews';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

// Layout wrapper – hides footer on admin routes
const ClientLayout = ({ children }) => {
    const { pathname } = useLocation();
    const isAdminRoute = pathname.startsWith('/admin');
    return (
        <>
            {children}
            {!isAdminRoute && <Footer />}
        </>
    );
};

function App() {
    return (
        <ClientLayout>
            <Routes>
                {/* Client Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/bikes/:bikeSlug" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<Success />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Policy Routes */}
                <Route path="/delivery-returns" element={<DeliveryReturns />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin" element={
                    <ProtectedAdminRoute>
                        <AdminDashboard />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/brands" element={
                    <ProtectedAdminRoute>
                        <AdminBrands />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/models" element={
                    <ProtectedAdminRoute>
                        <AdminModels />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedAdminRoute>
                        <AdminOrders />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/reports" element={
                    <ProtectedAdminRoute>
                        <AdminReports />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/coupons" element={
                    <ProtectedAdminRoute>
                        <AdminCoupons />
                    </ProtectedAdminRoute>
                } />

                <Route path="/admin/enquiries" element={
                    <ProtectedAdminRoute>
                        <AdminEnquiries />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/bikes" element={
                    <ProtectedAdminRoute>
                        <AdminBikes />
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/reviews" element={
                    <ProtectedAdminRoute>
                        <AdminReviews />
                    </ProtectedAdminRoute>
                } />

                {/* Redirects */}
                <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </ClientLayout>
    );
}

export default App;
