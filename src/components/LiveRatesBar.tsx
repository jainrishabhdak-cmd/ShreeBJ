import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { TrendingUp, Info, X } from 'lucide-react';

export const LiveRatesBar: React.FC = () => {
  const { language, rates, settings } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const t = translations[language];

  if (!rates || !rates.enabled) {
    return null;
  }

  // Format currency in Indian standard
  const formatInr = (num: number) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  const formattedDate = new Date(rates.lastUpdated).toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-IN',
    { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  return (
    <>
      <section className="bg-[#14213D]/70 border-b border-[#E5E4E2]/15 py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
          {/* Headline & Source */}
          <div className="w-full md:w-auto flex items-center justify-between gap-2 text-[#E5E4E2]">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#D4AF75] shrink-0" />
              <span className="font-semibold text-white text-xs sm:text-sm">
                {language === 'hi' ? 'दैनिक मानक बुलियन दरें' : 'Daily Bullion Benchmark'}
              </span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="md:hidden text-[11px] text-[#D4AF75] hover:underline flex items-center gap-1 font-sans py-1 px-1.5 rounded bg-black/40 border border-[#D4AF75]/30 min-touch-target"
              title="Read price transparency notice"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'मूल्य नियम' : 'Details'}</span>
            </button>
          </div>

          {/* Rates Ticker - Horizontal touch scroll on small devices */}
          <div className="w-full md:w-auto flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-none py-1 font-mono tabular-nums text-xs">
            <div className="flex items-center gap-1.5 bg-black/40 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-md border border-[#E5E4E2]/10 sm:border-0 shrink-0">
              <span className="text-[#E5E4E2]/70 text-[11px] sm:text-xs font-sans whitespace-nowrap">
                {language === 'hi' ? '२४K (१०g):' : '24K (10g):'}
              </span>
              <span className="font-semibold text-[#D4AF75] whitespace-nowrap">{formatInr(rates.gold24k)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-md border border-[#E5E4E2]/10 sm:border-0 shrink-0">
              <span className="text-[#E5E4E2]/70 text-[11px] sm:text-xs font-sans whitespace-nowrap">
                {language === 'hi' ? '२२K (१०g):' : '22K (10g):'}
              </span>
              <span className="font-semibold text-[#D4AF75] whitespace-nowrap">{formatInr(rates.gold22k)}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-md border border-[#E5E4E2]/10 sm:border-0 shrink-0">
              <span className="text-[#E5E4E2]/70 text-[11px] sm:text-xs font-sans whitespace-nowrap">
                {language === 'hi' ? 'चांदी (१kg):' : 'Silver (1kg):'}
              </span>
              <span className="font-semibold text-[#E5E4E2] whitespace-nowrap">{formatInr(rates.silver1kg)}</span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="hidden md:flex text-xs text-[#D4AF75] hover:underline items-center gap-1 font-sans shrink-0 ml-1"
              title="Read price transparency notice"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'मूल्य नियम' : 'Price Details'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Transparency Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-[#14213D] border border-[#E5E4E2]/20 rounded-xl p-6 max-w-lg w-full text-white shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#E5E4E2]/70 hover:text-white rounded-full bg-black/30"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-[#D4AF75]" />
              <h3 className="font-display text-lg font-semibold text-white">
                {t.rates.disclaimerTitle}
              </h3>
            </div>

            <p className="text-sm text-[#E5E4E2]/90 leading-relaxed mb-4">
              {language === 'hi' ? rates.disclaimerHi : rates.disclaimerEn}
            </p>

            <div className="bg-black/40 rounded-lg p-3 text-xs text-[#E5E4E2]/80 space-y-1.5 border border-[#E5E4E2]/10">
              <p className="font-semibold text-[#D4AF75]">
                {language === 'hi' ? 'आभूषण मूल्य गणना सूत्र:' : 'How Final Jewellery Price is Calculated:'}
              </p>
              <p>
                {language === 'hi'
                  ? 'अंतिम मूल्य = (शुद्ध सोने/चांदी का वजन × दैनिक भाव) + मेकिंग चार्ज (निर्माण शुल्क) + रत्न/मोती लागत + ३% जीएसटी'
                  : 'Final Price = (Net Precious Metal Weight × Live Bullion Rate) + Crafting / Making Charges + Stone Value + 3% GST'}
              </p>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-[#D4AF75] text-[#0B0B0C] text-xs font-semibold rounded hover:bg-[#c49a55] transition-colors"
              >
                {language === 'hi' ? 'समझ गया' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
