import React from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { MapPin, Phone, MessageCircle, Instagram, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { PageView } from '../types';

export const Footer: React.FC = () => {
  const { language, settings, setCurrentPage, generateWhatsappUrl } = useStore();
  const t = translations[language];

  const handlePageClick = (page: PageView) => {
    setCurrentPage(page);
  };

  return (
    <footer className="bg-[#000000] border-t border-[#E5E4E2]/15 text-[#E5E4E2] pt-14 pb-28 sm:pb-16 md:pb-10 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#E5E4E2]/15">
          
          {/* Col 1: Official Brand Identity & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#D4AF75]/50 shadow bg-transparent p-0.5 flex items-center justify-center">
                <img
                  src="/sbj-logo.png"
                  alt="Shree Bherunath Jewellers Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#F8F5EF] tracking-wide">
                  {language === 'hi' ? settings.brandNameHi : settings.brandNameEn}
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#D4AF75]">
                  {language === 'hi' ? 'सोना एवं चांदी' : 'Gold & Silver Jewellery'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#E5E4E2]/75 leading-relaxed">
              {language === 'hi'
                ? 'राजसी राजस्थानी संस्कृति, बीआईएस प्रमाणित हॉलमार्क सोने एवं शुद्ध चांदी के आभूषणों का विश्वसनीय नाम।'
                : 'Purity, royal heritage, and generational trust in handcrafted BIS hallmarked 22k gold and 925 fine sterling silver jewellery.'}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-[#E5E4E2]/80">
              <ShieldCheck className="w-4 h-4 text-[#D4AF75] shrink-0" />
              <span>{language === 'hi' ? '१००% बीआईएस हॉलमार्क शुद्धता' : '100% BIS Hallmarked Purity'}</span>
            </div>
          </div>

          {/* Col 2: Collections & Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wider uppercase border-b border-[#E5E4E2]/15 pb-2">
              {t.footer.collections}
            </h4>
            <ul className="space-y-2 text-xs">
              {['Gold Jewellery', 'Silver Jewellery', 'Bridal Jewellery', 'Traditional Jewellery', 'Rings', 'Necklaces'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handlePageClick('collections')}
                    className="hover:text-[#D4AF75] transition-colors text-left"
                  >
                    {t.categories[cat as keyof typeof t.categories] || cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Verified Showroom & Hours */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wider uppercase border-b border-[#E5E4E2]/15 pb-2">
              {t.contact.addressTitle}
            </h4>
            <div className="space-y-2.5 text-xs text-[#E5E4E2]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF75] shrink-0 mt-0.5" />
                <span>{language === 'hi' ? settings.addressHi : settings.addressEn}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#D4AF75] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-white">{t.contact.hoursTitle}</span>
                  <span className="text-[11px] text-[#E5E4E2]/70">
                    {language === 'hi' ? settings.openingHoursHi : settings.openingHoursEn}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D4AF75] hover:underline"
                >
                  <span>{t.contact.directionsBtn}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Verified Direct Channels */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white tracking-wider uppercase border-b border-[#E5E4E2]/15 pb-2">
              {language === 'hi' ? 'सीधा संपर्क' : 'Direct Inquiries'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-[#E5E4E2] hover:text-[#D4AF75] transition-colors group"
              >
                <div className="p-2 rounded bg-[#14213D] border border-[#E5E4E2]/10 group-hover:border-[#D4AF75]/50">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF75]" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#E5E4E2]/50 uppercase">{t.contact.phoneTitle}</span>
                  <span className="font-medium text-white">{settings.phone}</span>
                </div>
              </a>

              <a
                href={generateWhatsappUrl(null)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#E5E4E2] hover:text-[#25D366] transition-colors group"
              >
                <div className="p-2 rounded bg-[#14213D] border border-[#E5E4E2]/10 group-hover:border-[#25D366]/50">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#E5E4E2]/50 uppercase">{t.contact.whatsappTitle}</span>
                  <span className="font-medium text-white">+{settings.whatsappNumber}</span>
                </div>
              </a>

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#E5E4E2] hover:text-[#D4AF75] transition-colors group"
              >
                <div className="p-2 rounded bg-[#14213D] border border-[#E5E4E2]/10 group-hover:border-[#D4AF75]/50">
                  <Instagram className="w-3.5 h-3.5 text-[#D4AF75]" />
                </div>
                <div>
                  <span className="block text-[10px] text-[#E5E4E2]/50 uppercase">{t.contact.instagramTitle}</span>
                  <span className="font-medium text-white">@s_b_j_silver_hub</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E5E4E2]/60">
          <div>{t.footer.copyright}</div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
            <button
              onClick={() => handlePageClick('privacy')}
              className="py-1 px-1 hover:text-white transition-colors"
            >
              {t.footer.legalLinks.privacy}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handlePageClick('terms')}
              className="py-1 px-1 hover:text-white transition-colors"
            >
              {t.footer.legalLinks.terms}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handlePageClick('cookie-policy')}
              className="py-1 px-1 hover:text-white transition-colors"
            >
              {t.footer.legalLinks.cookies}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handlePageClick('refund-policy')}
              className="py-1 px-1 hover:text-white transition-colors"
            >
              {t.footer.legalLinks.refund}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handlePageClick('accessibility')}
              className="py-1 px-1 hover:text-white transition-colors"
            >
              {t.footer.legalLinks.accessibility}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handlePageClick('admin')}
              className="py-1 px-1 text-[#D4AF75] hover:underline"
            >
              {t.nav.admin}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
