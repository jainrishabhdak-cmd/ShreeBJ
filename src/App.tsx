/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { ProductModal } from './components/ProductModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Product, PageView } from './types';

const MainLayout: React.FC = () => {
  const { currentPage, selectedProduct, setSelectedProduct } = useStore();

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onOpenProduct={handleOpenProduct} />;
      case 'collections':
        return <CollectionsPage onOpenProduct={handleOpenProduct} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      case 'privacy':
      case 'terms':
      case 'cookie-policy':
      case 'refund-policy':
      case 'accessibility':
        return <LegalPage initialTab={currentPage as any} />;
      case 'not-found':
        return <NotFoundPage />;
      default:
        return <HomePage onOpenProduct={handleOpenProduct} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F8F5EF] flex flex-col font-sans selection:bg-[#D4AF75] selection:text-[#0B0B0C] pb-20 md:pb-0">
      {/* 3-Zone Luxury Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1" id="main-content">
        {renderContent()}
      </main>

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={handleCloseProduct} />

      {/* Cookie / Privacy Consent Notice */}
      <CookieBanner />

      {/* Luxury Footer with Verified Links & Hallmarking Badges */}
      <Footer />

      {/* Touch-First Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
