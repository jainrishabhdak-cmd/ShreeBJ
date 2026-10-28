export type Language = 'en' | 'hi';

export type ProductCategory =
  | 'Gold Jewellery'
  | 'Silver Jewellery'
  | 'Rings'
  | 'Necklaces'
  | 'Earrings'
  | 'Bangles'
  | 'Traditional Jewellery'
  | 'Bridal Jewellery';

export interface Product {
  id: string;
  nameEn: string;
  nameHi: string;
  category: ProductCategory;
  materialEn: string;
  materialHi: string;
  purity: string;
  weight: string;
  dimensions?: string;
  price: number | null; // null represents "Price on Request"
  availability: 'In Stock' | 'Made to Order' | 'Available on Request';
  isFeatured: boolean;
  image: string;
  descriptionEn: string;
  descriptionHi: string;
}

export interface StoreSettings {
  brandNameEn: string;
  brandNameHi: string;
  taglineEn: string;
  taglineHi: string;
  logoText: string;
  category: string;
  whatsappNumber: string;
  phone: string;
  addressEn: string;
  addressHi: string;
  instagramUrl: string;
  mapsUrl: string;
  openingHoursEn: string;
  openingHoursHi: string;
  liveRatesEnabled: boolean;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  ratesSource: string;
  ratesLastUpdated: string;
}

export interface BullionRates {
  enabled: boolean;
  gold24k: number;
  gold22k: number;
  silver1kg: number;
  source: string;
  lastUpdated: string;
  disclaimerEn: string;
  disclaimerHi: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  details: string;
}

export type PageView =
  | 'home'
  | 'collections'
  | 'about'
  | 'contact'
  | 'product-detail'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'cookie-policy'
  | 'refund-policy'
  | 'accessibility'
  | 'not-found';
