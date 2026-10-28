import React from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { Shield, Check, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { language, cookieConsent, setCookieConsent, setCurrentPage } = useStore();
  const t = translations[language];

  if (cookieConsent) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#14213D]/95 backdrop-blur-md border-t border-[#E5E4E2]/20 p-4 sm:p-5 shadow-2xl text-white"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#D4AF75] shrink-0 mt-0.5" />
          <div className="text-xs text-[#E5E4E2]/90 leading-relaxed">
            <span className="font-semibold text-white block mb-0.5">{t.cookie.title}</span>
            <span>{t.cookie.desc} </span>
            <button
              onClick={() => setCurrentPage('cookie-policy')}
              className="text-[#D4AF75] underline hover:text-[#ffe29a] ml-1"
            >
              {language === 'hi' ? 'कुकी नीति पढ़ें' : 'Read Cookie Policy'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => setCookieConsent('essential')}
            className="flex-1 md:flex-none px-3.5 py-1.5 text-xs font-medium border border-[#E5E4E2]/30 hover:border-white rounded text-[#E5E4E2] hover:text-white transition-colors"
          >
            {t.cookie.essentialOnly}
          </button>

          <button
            onClick={() => setCookieConsent('accepted')}
            className="flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold bg-[#D4AF75] hover:bg-[#e2930f] text-[#000000] rounded transition-colors"
          >
            {t.cookie.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
};
