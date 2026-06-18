import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import NotFound from '@/components/NotFound';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import ScrollToTop from '@/components/ScrollToTop';
import { ProductDataProvider } from '@/context/ProductDataContext';
import { CartProvider } from '@/context/CartContext';

// Main App component with routing + shared providers
const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ProductDataProvider>
        <CartProvider>
          {/* Toast notifications (available on every route) */}
          <Toaster />

          <Routes>
            {/* Home route */}
            <Route path="/" element={<Home />} />

            {/* Shareable product page */}
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* 404 Not Found route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </ProductDataProvider>
    </BrowserRouter>
  );
};

export default App;
