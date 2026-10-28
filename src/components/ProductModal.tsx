import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { X, MessageCircle, ShieldCheck, Scale, Ruler, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { language, generateWhatsappUrl, settings } = useStore();
  const [imgError, setImgError] = useState(false);
  const t = translations[language];

  useEffect(() => {
    setImgError(false);
  }, [product?.id, product?.image]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  const title = language === 'hi' ? product.nameHi : product.nameEn;
  const description = language === 'hi' ? product.descriptionHi : product.descriptionEn;
  const material = language === 'hi' ? product.materialHi : product.materialEn;
  const categoryLabel = t.categories[product.category] || product.category;

  const prefilledMessage = language === 'hi'
    ? `नमस्ते श्री भेरूनाथ ज्वेलर्स, मैं ${product.nameHi} के बारे में जानकारी चाहता/चाहती हूँ। कृपया इसकी जानकारी और वर्तमान कीमत बताएं।`
    : `Hello Shree Bherunath Jewellers, I would like to enquire about ${product.nameEn}. Please share the product details and current price.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#14213D] border-t sm:border border-[#E5E4E2]/25 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-white max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 flex items-center justify-center text-[#E5E4E2] hover:text-white rounded-full bg-black/70 hover:bg-black transition-colors min-touch-target shadow-lg"
          aria-label="Close product details"
        >
          <X className="w-5 h-5 text-[#D4AF75]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto flex-1 touch-scroll">
          {/* Left: Product Image Area */}
          <div className="relative bg-black flex items-center justify-center p-4 sm:p-6 min-h-[220px] sm:min-h-[300px] md:min-h-[460px] border-b md:border-b-0 md:border-r border-[#E5E4E2]/15">
            {!imgError ? (
              <img
                src={product.image}
                alt={title}
                className="max-h-[340px] w-auto object-contain mx-auto transition-transform hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center p-8">
                <Sparkles className="w-12 h-12 text-[#D4AF75] mx-auto mb-3" />
                <span className="font-display text-lg text-white font-medium">{product.purity}</span>
                <p className="text-xs text-[#E5E4E2]/60 mt-1 uppercase tracking-widest">{categoryLabel}</p>
              </div>
            )}

            {/* Official Hallmark Tag */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-[#D4AF75]/40 rounded px-2.5 py-1 text-[11px] font-mono text-[#D4AF75] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{product.purity}</span>
            </div>
          </div>

          {/* Right: Product Details and Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs text-[#E5E4E2]/70 mb-2">
                <span>{categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D4AF75] font-medium">{product.availability}</span>
              </div>

              {/* Title */}
              <h2 id="product-modal-title" className="font-display text-xl sm:text-2xl font-semibold text-white mb-3">
                {title}
              </h2>

              {/* Price / Price on Request */}
              <div className="mb-5 p-3.5 bg-black/40 rounded-xl border border-[#E5E4E2]/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#E5E4E2]/60 block">
                    {language === 'hi' ? 'मूल्य निर्धारण' : 'Pricing Status'}
                  </span>
                  <span className={`text-lg font-semibold ${product.price ? 'font-mono text-[#D4AF75] tabular-nums' : 'text-[#E5E4E2]'}`}>
                    {product.price ? '₹' + product.price.toLocaleString('en-IN') : t.product.priceOnRequest}
                  </span>
                </div>
                <div className="text-right text-[11px] text-[#E5E4E2]/60 max-w-[150px]">
                  {language === 'hi' ? 'दैनिक भाव अनुसार' : 'Based on daily bullion rates'}
                </div>
              </div>

              {/* Specifications List */}
              <div className="space-y-2.5 text-xs text-[#E5E4E2]/90 mb-5">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF75] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">{t.product.purity}: </span>
                    <span>{product.purity}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-[#D4AF75] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">{t.product.weight}: </span>
                    <span className="font-mono tabular-nums">{product.weight}</span>
                  </div>
                </div>

                {product.dimensions && (
                  <div className="flex items-start gap-2">
                    <Ruler className="w-4 h-4 text-[#D4AF75] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{t.product.dimensions}: </span>
                      <span>{product.dimensions}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF75] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">{t.product.material}: </span>
                    <span>{material}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed mb-6">
                {description}
              </p>

              {/* Prepared WhatsApp Inquiry Preview */}
              <div className="bg-[#000000]/60 border border-[#25D366]/30 rounded-xl p-3.5 mb-6 text-xs">
                <div className="flex items-center gap-1.5 text-[#25D366] font-semibold mb-1.5">
                  <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                  <span>{language === 'hi' ? 'तैयार व्हाट्सएप संदेश:' : 'Prepared WhatsApp Message:'}</span>
                </div>
                <p className="text-[#E5E4E2]/90 italic bg-black/40 p-2.5 rounded border border-[#E5E4E2]/10 select-all">
                  "{prefilledMessage}"
                </p>
                <p className="text-[11px] text-[#E5E4E2]/60 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#D4AF75]" />
                  <span>{t.product.whatsappNotice}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons - Sticky at bottom for mobile convenience */}
            <div className="sticky bottom-0 bg-[#14213D]/95 backdrop-blur-md -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 border-t border-[#E5E4E2]/15 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 z-10">
              <a
                href={generateWhatsappUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex-1 min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-semibold rounded-xl transition-colors shadow-md min-touch-target"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{t.product.enquireWhatsapp}</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 bg-[#0B0B0C] border border-[#E5E4E2]/20 hover:border-[#D4AF75] text-[#E5E4E2] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center text-center min-touch-target"
              >
                {t.contact.callBtn}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
