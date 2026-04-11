import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Footer from './components/common/Footer';

// Lazy load Client pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const Contact = lazy(() => import('./pages/Contact'));

// Policy pages
const DeliveryReturns = lazy(() => import('./pages/Policies/DeliveryReturns'));
const RefundPolicy = lazy(() => import('./pages/Policies/RefundPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/Policies/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Policies/TermsOfService'));
const ShippingPolicy = lazy(() => import('./pages/Policies/ShippingPolicy'));

// Lazy load Admin pages
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminBrands = lazy(() => import('./pages/Admin/Brands'));
const AdminModels = lazy(() => import('./pages/Admin/Models'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));
const AdminCoupons = lazy(() => import('./pages/Admin/Coupons'));
const AdminEnquiries = lazy(() => import('./pages/Admin/Enquiries'));
const AdminBikes = lazy(() => import('./pages/Admin/Bikes'));

const Loader = () => (
    <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent animate-spin rounded-full" />
    </div>
);

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
        <Suspense fallback={<Loader />}>
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

                    {/* Redirects */}
                    <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ClientLayout>
        </Suspense>
    );
}

export default App;

