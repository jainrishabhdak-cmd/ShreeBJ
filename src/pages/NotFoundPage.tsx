import React from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { Home, Compass, MessageCircle, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { language, setCurrentPage, generateWhatsappUrl } = useStore();
  const t = translations[language];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center bg-[#14213D]/40 border border-[#E5E4E2]/20 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Emblem or Icon with Transparent Background */}
        <div className="w-20 h-20 mx-auto rounded-full bg-transparent border border-[#D4AF75]/50 p-1 flex items-center justify-center shadow">
          <img
            src="/sbj-logo.png"
            alt="Shree Bherunath Jewellers"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-sm tracking-widest text-[#D4AF75] block uppercase">
            Error 404
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {language === 'hi' ? 'यह पेज उपलब्ध नहीं है।' : 'Looks like this page has gone missing.'}
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E4E2]/75 leading-relaxed">
            {t.notFound.sub}
          </p>
        </div>

        {/* 3 Required Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full py-2.5 px-4 bg-[#D4AF75] hover:bg-[#c49a55] text-[#0B0B0C] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" />
            <span>{t.notFound.homeBtn}</span>
          </button>

          <button
            onClick={() => setCurrentPage('collections')}
            className="w-full py-2.5 px-4 bg-[#14213D] hover:bg-[#1f325c] border border-[#E5E4E2]/20 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#D4AF75]" />
            <span>{t.notFound.collectionsBtn}</span>
          </button>

          <a
            href={generateWhatsappUrl(null)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.notFound.whatsappBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
