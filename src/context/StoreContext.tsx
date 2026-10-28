import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, PageView, Product, StoreSettings, BullionRates } from '../types';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView, product?: Product | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  settings: StoreSettings;
  products: Product[];
  rates: BullionRates | null;
  loading: boolean;
  adminToken: string | null;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  refreshData: () => Promise<void>;
  generateWhatsappUrl: (product?: Product | null) => string;
  cookieConsent: string | null;
  setCookieConsent: (consent: string) => void;
}

const defaultSettings: StoreSettings = {
  brandNameEn: 'Shree Bherunath Jewellers',
  brandNameHi: 'श्री भेरूनाथ ज्वेलर्स',
  taglineEn: 'Timeless Tradition. Exceptional Elegance.',
  taglineHi: 'परंपरा की खूबसूरती, आभूषणों की चमक।',
  logoText: 'SBJ',
  category: 'Gold & Silver Jewellery',
  whatsappNumber: '918850032920',
  phone: '+91 88500 32920',
  addressEn: 'Shree Bherunath Jewellers, Near Kankroli Bus Stand, Kankroli, Rajsamand, Rajasthan 313324, India',
  addressHi: 'श्री भेरूनाथ ज्वेलर्स, कांकरोली बस स्टैंड के पास, कांकरोली, राजसमंद, राजस्थान ३१३३२४, भारत',
  instagramUrl: 'https://www.instagram.com/s_b_j_silver_hub?srtk=bGhmc3V0ajI1NTF4',
  mapsUrl: 'https://maps.google.com/?q=Shree+Bherunath+Jewellers+Near+Kankroli+Bus+Stand+Rajsamand+Rajasthan',
  openingHoursEn: 'Mon – Sat: 10:30 AM – 8:30 PM | Sunday: 11:00 AM – 6:00 PM',
  openingHoursHi: 'सोम – शनि: सुबह 10:30 – रात 8:30 | रविवार: सुबह 11:00 – शाम 6:00',
  liveRatesEnabled: true,
  gold24kRate: 78500,
  gold22kRate: 72000,
  silverRate: 94000,
  ratesSource: 'IBJA (India Bullion and Jewellers Association) benchmark',
  ratesLastUpdated: new Date().toISOString()
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sbj_language');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const getInitialPage = (): PageView => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\//, '');
    if (!path || path === '') return 'home';
    if (['collections', 'about', 'contact', 'admin', 'privacy', 'terms', 'cookie-policy', 'refund-policy', 'accessibility'].includes(path)) {
      return path as PageView;
    }
    return 'not-found';
  };

  const [currentPage, setCurrentPageState] = useState<PageView>(getInitialPage);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<BullionRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('sbj_admin_token');
  });
  const [cookieConsent, setCookieConsentState] = useState<string | null>(() => {
    return localStorage.getItem('sbj_cookie_consent');
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sbj_language', lang);
    document.documentElement.lang = lang;
  };

  const setCookieConsent = (consent: string) => {
    setCookieConsentState(consent);
    localStorage.setItem('sbj_cookie_consent', consent);
  };

  const setCurrentPage = (page: PageView, product?: Product | null) => {
    setCurrentPageState(page);
    if (product !== undefined) {
      setSelectedProduct(product);
    }
    if (typeof window !== 'undefined') {
      const targetPath = page === 'home' ? '/' : `/${page}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (!path || path === '') {
        setCurrentPageState('home');
      } else if (['collections', 'about', 'contact', 'admin', 'privacy', 'terms', 'cookie-policy', 'refund-policy', 'accessibility'].includes(path)) {
        setCurrentPageState(path as PageView);
      } else {
        setCurrentPageState('not-found');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, productsRes, ratesRes] = await Promise.all([
        fetch('/api/settings').catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/rates').catch(() => null)
      ]);

      if (settingsRes && settingsRes.ok) {
        const sData = await settingsRes.json();
        setSettings(sData);
      }

      if (productsRes && productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData);
      }

      if (ratesRes && ratesRes.ok) {
        const rData = await ratesRes.json();
        setRates(rData);
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loginAdmin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, error: data.error || 'Authentication failed' };
      }

      const { token } = await res.json();
      sessionStorage.setItem('sbj_admin_token', token);
      setAdminToken(token);
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error while contacting server.' };
    }
  };

  const logoutAdmin = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(() => {});
    }
    sessionStorage.removeItem('sbj_admin_token');
    setAdminToken(null);
  };

  const generateWhatsappUrl = (product?: Product | null): string => {
    // Sanitized phone without + or spaces
    const cleanNumber = (settings.whatsappNumber || '919829012345').replace(/\D/g, '');

    let message = '';
    if (product) {
      const productName = language === 'hi' ? product.nameHi : product.nameEn;
      if (language === 'hi') {
        message = `नमस्ते श्री भेरूनाथ ज्वेलर्स, मैं ${productName} के बारे में जानकारी चाहता/चाहती हूँ। कृपया इसकी जानकारी और वर्तमान कीमत बताएं।`;
      } else {
        message = `Hello Shree Bherunath Jewellers, I would like to enquire about ${productName}. Please share the product details and current price.`;
      }
    } else {
      if (language === 'hi') {
        message = `नमस्ते श्री भेरूनाथ ज्वेलर्स, मैं आपके सोने और चांदी के आभूषण संग्रह के बारे में जानकारी प्राप्त करना चाहता/चाहती हूँ।`;
      } else {
        message = `Hello Shree Bherunath Jewellers, I would like to enquire about your gold and silver jewellery collections.`;
      }
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currentPage,
        setCurrentPage,
        selectedProduct,
        setSelectedProduct,
        settings,
        products,
        rates,
        loading,
        adminToken,
        loginAdmin,
        logoutAdmin,
        refreshData: fetchData,
        generateWhatsappUrl,
        cookieConsent,
        setCookieConsent
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
