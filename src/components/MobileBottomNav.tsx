import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Gem, Phone, MessageCircle, MapPin } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, settings, language, generateWhatsappUrl } = useStore();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-xl border-t border-[#E5E4E2]/15 pb-safe transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* Home */}
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-touch-target ${
            currentPage === 'home' ? 'text-[#D4AF75]' : 'text-[#E5E4E2]/70 hover:text-white'
          }`}
          aria-label="Go to Homepage"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">
            {language === 'hi' ? 'होम' : 'Home'}
          </span>
          {currentPage === 'home' && (
            <span className="w-1 h-1 bg-[#D4AF75] rounded-full mt-0.5" />
          )}
        </button>

        {/* Collections */}
        <button
          onClick={() => setCurrentPage('collections')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-touch-target ${
            currentPage === 'collections' ? 'text-[#D4AF75]' : 'text-[#E5E4E2]/70 hover:text-white'
          }`}
          aria-label="View Collections"
        >
          <Gem className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">
            {language === 'hi' ? 'संग्रह' : 'Jewellery'}
          </span>
          {currentPage === 'collections' && (
            <span className="w-1 h-1 bg-[#D4AF75] rounded-full mt-0.5" />
          )}
        </button>

        {/* Instant Call */}
        <a
          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center py-1 text-[#E5E4E2]/70 hover:text-[#D4AF75] transition-colors min-touch-target"
          aria-label="Call Shree Bherunath Jewellers"
        >
          <div className="w-8 h-8 rounded-full bg-[#14213D] border border-[#E5E4E2]/20 flex items-center justify-center mb-0.5">
            <Phone className="w-4 h-4 text-[#D4AF75]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight">
            {language === 'hi' ? 'कॉल' : 'Call'}
          </span>
        </a>

        {/* WhatsApp Chat */}
        <a
          href={generateWhatsappUrl(null)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 text-[#25D366] hover:text-[#20ba5a] transition-colors min-touch-target"
          aria-label="Enquire on WhatsApp"
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center mb-0.5">
            <MessageCircle className="w-4 h-4 fill-[#25D366] text-transparent" />
          </div>
          <span className="text-[10px] font-medium tracking-tight font-semibold">
            {language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}
          </span>
        </a>

        {/* Location / Boutique */}
        <button
          onClick={() => setCurrentPage('contact')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-touch-target ${
            currentPage === 'contact' ? 'text-[#D4AF75]' : 'text-[#E5E4E2]/70 hover:text-white'
          }`}
          aria-label="Showroom Location near Kankroli Bus Stand"
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">
            {language === 'hi' ? 'दुकान' : 'Visit'}
          </span>
          {currentPage === 'contact' && (
            <span className="w-1 h-1 bg-[#D4AF75] rounded-full mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
