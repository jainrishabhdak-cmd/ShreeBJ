import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { MessageCircle, Menu, X, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { PageView } from '../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, currentPage, setCurrentPage, settings, generateWhatsappUrl } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navLinks: { label: string; page: PageView }[] = [
    { label: t.nav.home, page: 'home' },
    { label: t.nav.collections, page: 'collections' },
    { label: t.nav.rates, page: 'rates' as PageView },
    { label: t.nav.about, page: 'about' },
    { label: t.nav.contact, page: 'contact' },
  ];

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcements & Quick Contact Strip */}
      <div className="bg-[#14213D] border-b border-[#E5E4E2]/15 text-[#E5E4E2] text-[11px] sm:text-xs py-1.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF75] shrink-0" />
            <span className="font-medium tracking-wide whitespace-nowrap">
              {language === 'hi'
                ? '१००% बीआईएस हॉलमार्क सोना (९१६) एवं ९२५ चांदी'
                : '100% BIS Hallmarked 22K (916) Gold & 925 Silver'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] sm:text-xs">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#D4AF75] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#D4AF75]" />
              <span className="font-mono">{settings.phone}</span>
            </a>
            <span className="text-[#E5E4E2]/30 hidden sm:inline" aria-hidden="true">|</span>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#D4AF75] transition-colors whitespace-nowrap"
            >
              <MapPin className="w-3 h-3 text-[#D4AF75]" />
              <span>{language === 'hi' ? 'कांकरोली बस स्टैंड के पास, राजसमंद' : 'Near Kankroli Bus Stand, Rajsamand'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#E5E4E2]/15 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Zone 1: Brand Identity with Official Logo with Transparent Background */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none min-touch-target"
            aria-label={`${settings.brandNameEn} Home`}
          >
            {/* Official SBJ Logo image - unmodified, preserved in natural circle with transparent background */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border border-[#D4AF75]/40 shadow-sm bg-transparent group-hover:border-[#D4AF75] transition-colors flex items-center justify-center">
              <img
                src="/sbj-logo.png"
                alt="Shree Bherunath Jewellers Official Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col truncate">
              <span className="font-display text-sm sm:text-lg md:text-xl font-semibold tracking-wide text-[#F8F5EF] group-hover:text-[#D4AF75] transition-colors truncate">
                {language === 'hi' ? settings.brandNameHi : settings.brandNameEn}
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-[#D4AF75]/90 truncate">
                {language === 'hi' ? 'सोना एवं चांदी के आभूषण' : 'Gold & Silver Jewellery'}
              </span>
            </div>
          </button>

          {/* Zone 2: Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? 'text-[#D4AF75] font-semibold' : 'text-[#E5E4E2] hover:text-[#F8F5EF]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF75] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher & WhatsApp CTA Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher Button (EN | हिन्दी) */}
            <div className="flex items-center border border-[#E5E4E2]/20 rounded-md p-0.5 bg-[#14213D]/60">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  language === 'en'
                    ? 'bg-[#D4AF75] text-[#0B0B0C]'
                    : 'text-[#E5E4E2] hover:text-white'
                }`}
                title="Switch to English"
                aria-label="Switch language to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors font-hindi ${
                  language === 'hi'
                    ? 'bg-[#D4AF75] text-[#0B0B0C]'
                    : 'text-[#E5E4E2] hover:text-white'
                }`}
                title="हिन्दी में बदलें"
                aria-label="Switch language to Hindi"
              >
                हिन्दी
              </button>
            </div>

            {/* Direct WhatsApp Enquiry Button */}
            <a
              href={generateWhatsappUrl(null)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#25D366] text-white rounded-md hover:bg-[#20ba5a] transition-colors shadow-sm whitespace-nowrap"
              title={t.nav.enquireWhatsapp}
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t.nav.enquireWhatsapp}</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-[#E5E4E2] hover:text-[#FFFFFF] hover:bg-[#14213D] rounded-lg transition-colors min-touch-target"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF75]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Backdrop & Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 sm:top-20 bg-black/70 backdrop-blur-sm z-30 md:hidden animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-40 md:hidden bg-[#0B0B0C] border-b border-[#E5E4E2]/20 px-5 py-4 space-y-3 shadow-2xl">
              <div className="flex flex-col space-y-1">
                {navLinks.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`text-left py-3 px-3 rounded-lg text-base font-medium transition-colors flex items-center justify-between min-touch-target ${
                      currentPage === item.page
                        ? 'bg-[#14213D] text-[#D4AF75] font-semibold'
                        : 'text-[#E5E4E2] hover:bg-black/50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {currentPage === item.page && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF75]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E5E4E2]/15 flex flex-col gap-2.5">
                <a
                  href={generateWhatsappUrl(null)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-colors min-touch-target shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t.nav.enquireWhatsapp}</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#E5E4E2] bg-[#14213D] hover:bg-[#1a2d54] rounded-lg transition-colors min-touch-target"
                >
                  <Phone className="w-4 h-4 text-[#D4AF75]" />
                  <span className="font-mono">{settings.phone}</span>
                </a>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};
