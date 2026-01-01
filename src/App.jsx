import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SaleBanner from './components/SaleBanner';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Complaint from './pages/Complaint';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);

  return (
    <div className="app">
      <SaleBanner isVisible={isBannerVisible} onClose={() => setIsBannerVisible(false)} />
      <Navbar isBannerVisible={isBannerVisible} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/collections" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
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
}

export default App;
