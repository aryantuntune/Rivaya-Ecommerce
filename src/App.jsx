import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SaleBanner from './components/SaleBanner';
import ScrollToTop from './components/ScrollToTop';


// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import AboutUs from './pages/AboutUs';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Complaint from './pages/Complaint';
import AdminDashboard from './pages/AdminDashboard';
import Collections from './pages/Collections';

const App = () => {
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Calculate top padding:
  // - Home: 0 (Hero goes to top, behind navbar)
  // - Admin: Header Height (No banner)
  // - Others: Header Height + (Banner Height if visible)
  const getPaddingTop = () => {
    if (isHomePage) return 0;
    if (isAdminRoute) return 'var(--header-height)';
    return isBannerVisible ? 'calc(var(--header-height) + 48px)' : 'var(--header-height)';
  };

  return (
    <div className="app">
      <ScrollToTop />
      {!isAdminRoute && <SaleBanner isVisible={isBannerVisible} onClose={() => setIsBannerVisible(false)} />}
      <Navbar isBannerVisible={isBannerVisible && !isAdminRoute} />
      <main style={{ paddingTop: getPaddingTop() }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;
