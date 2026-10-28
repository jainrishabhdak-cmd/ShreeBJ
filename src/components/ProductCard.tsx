import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { MessageCircle, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { language, generateWhatsappUrl } = useStore();
  const [imgError, setImgError] = useState(false);
  const t = translations[language];

  useEffect(() => {
    setImgError(false);
  }, [product.image]);

  const title = language === 'hi' ? product.nameHi : product.nameEn;
  const categoryLabel = t.categories[product.category] || product.category;

  // Format price if available
  const formattedPrice = product.price
    ? '₹' + product.price.toLocaleString('en-IN')
    : (language === 'hi' ? 'कीमत जानने के लिए संपर्क करें' : 'Price on Request');

  return (
    <article className="group bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-xl overflow-hidden hover:border-[#D4AF75]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:shadow-[#D4AF75]/5">
      {/* Product Image Area - clickable on mobile & desktop */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative aspect-[4/3] bg-black/60 overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#14213D] to-black">
            <Sparkles className="w-8 h-8 text-[#D4AF75] mb-2 opacity-80" />
            <span className="font-display text-sm text-[#E5E4E2] font-medium">{product.purity}</span>
            <span className="text-[11px] text-[#E5E4E2]/50 mt-1 uppercase tracking-wider">{categoryLabel}</span>
          </div>
        )}

        {/* Quiet purity indicator */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm border border-[#E5E4E2]/20 rounded px-2 py-0.5 text-[10px] font-mono text-[#D4AF75] tracking-wide pointer-events-none">
          {product.purity}
        </div>

        {/* Quick View Overlay Button (Hover on desktop, invisible but accessible on mobile) */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2 text-xs font-semibold text-white backdrop-blur-[2px]"
          aria-hidden="true"
        >
          <span className="bg-[#0B0B0C]/90 px-3.5 py-2 rounded-md border border-[#E5E4E2]/20 flex items-center gap-1.5 shadow">
            <Eye className="w-3.5 h-3.5 text-[#D4AF75]" />
            {t.product.viewDetails}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata clean line (No pills) */}
          <div className="flex items-center gap-2 text-[11px] text-[#E5E4E2]/70 mb-1.5">
            <span>{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.weight}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="font-display text-base font-semibold text-white group-hover:text-[#D4AF75] transition-colors cursor-pointer line-clamp-2 mb-2"
          >
            {title}
          </h3>

          {/* Material & Gems snippet */}
          <p className="text-xs text-[#E5E4E2]/75 line-clamp-2 leading-relaxed mb-4">
            {language === 'hi' ? product.materialHi : product.materialEn}
          </p>
        </div>

        {/* Footer Area: Price & WhatsApp Action */}
        <div className="pt-3 border-t border-[#E5E4E2]/10 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#E5E4E2]/50">
              {product.price ? (language === 'hi' ? 'मूल्य' : 'Verified Price') : (language === 'hi' ? 'भाव' : 'Valuation')}
            </div>
            <div className={`text-sm font-semibold ${product.price ? 'font-mono text-[#D4AF75] tabular-nums' : 'text-[#E5E4E2]/90 text-xs'}`}>
              {formattedPrice}
            </div>
          </div>

          <a
            href={generateWhatsappUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-colors whitespace-nowrap shadow-sm min-touch-target"
            title={t.product.enquireWhatsapp}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>{language === 'hi' ? 'पूछें' : 'Enquire'}</span>
          </a>
        </div>
      </div>
    </article>
  );
};
