import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { ProductCategory, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, ShieldCheck, Sparkles } from 'lucide-react';

interface CollectionsPageProps {
  onOpenProduct: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onOpenProduct }) => {
  const { language, products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const t = translations[language];

  // Specific authorized categories sold by the shop
  const authorizedCategories: ProductCategory[] = [
    'Gold Jewellery',
    'Silver Jewellery',
    'Rings',
    'Necklaces',
    'Earrings',
    'Bangles',
    'Traditional Jewellery',
    'Bridal Jewellery'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.nameEn.toLowerCase().includes(q) ||
        item.nameHi.includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.purity.toLowerCase().includes(q) ||
        item.materialEn.toLowerCase().includes(q) ||
        item.materialHi.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E5E4E2]/15 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block mb-1.5">
              {language === 'hi' ? 'हस्तनिर्मित विरासत' : 'Authentic Hallmarked Catalog'}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
              {t.nav.collections}
            </h1>
            <p className="text-xs sm:text-sm text-[#E5E4E2]/80 max-w-2xl leading-relaxed">
              {t.categories.subtitle}.{' '}
              {language === 'hi'
                ? 'प्रत्येक आभूषण शुद्धता, वजन एवं बीआईएस हॉलमार्क विनिर्देशों के साथ प्रस्तुत है।'
                : 'Each piece features verified purity, certified weight, and official BIS hallmarking specifications.'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#E5E4E2]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'आभूषण खोजें (उदा. चोकर, पायल)...' : 'Search jewellery (e.g. choker, payal)...'}
              className="w-full bg-[#14213D] border border-[#E5E4E2]/20 rounded-lg pl-10 pr-9 py-2.5 text-base sm:text-xs text-white placeholder-[#E5E4E2]/40 focus:border-[#D4AF75] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-xs text-[#E5E4E2]/60 hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Clean Interactive Category Filter Bar */}
        <div className="mt-6 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`min-h-[44px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center justify-center ${
              selectedCategory === 'All'
                ? 'bg-[#D4AF75] text-[#0B0B0C] font-semibold shadow-sm'
                : 'bg-[#14213D]/60 text-[#E5E4E2] hover:text-white hover:bg-[#14213D]'
            }`}
          >
            {t.categories.all}
          </button>

          {authorizedCategories.map((cat) => {
            const label = t.categories[cat] || cat;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[44px] px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#D4AF75] text-[#0B0B0C] font-semibold shadow-sm'
                    : 'bg-[#14213D]/60 text-[#E5E4E2] hover:text-white hover:bg-[#14213D]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#E5E4E2]/70">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#D4AF75]" />
          <span>
            {language === 'hi' ? 'दिखाए जा रहे आभूषण:' : 'Showing:'}{' '}
            <strong className="text-white font-mono tabular-nums">{filteredProducts.length}</strong>{' '}
            {language === 'hi' ? 'उत्पाद' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#E5E4E2]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF75]" />
          <span>{language === 'hi' ? 'बीआईएस ९१६ एवं ९२५ प्रमाणित' : 'BIS 916 & 925 Certified'}</span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#14213D]/30 border border-[#E5E4E2]/15 rounded-2xl max-w-xl mx-auto space-y-4">
          <Sparkles className="w-10 h-10 text-[#D4AF75] mx-auto opacity-70" />
          <h3 className="font-display text-lg font-semibold text-white">
            {language === 'hi' ? 'कोई आभूषण नहीं मिला' : 'No Jewellery Pieces Found'}
          </h3>
          <p className="text-xs text-[#E5E4E2]/70 leading-relaxed">
            {language === 'hi'
              ? 'कृपया अपनी खोज शब्दों को बदलें या सभी संग्रह देखने के लिए फिल्टर हटाएं।'
              : 'Try searching with different keywords or reset your category filter to explore all available collections.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#D4AF75] text-[#000000] text-xs font-semibold rounded-lg hover:bg-[#e2930f] transition-colors"
          >
            {language === 'hi' ? 'फिल्टर हटाएं' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
