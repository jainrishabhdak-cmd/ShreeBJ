import React from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import {
  Sparkles,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Gem,
  Award,
  Crown,
  MapPin,
  Clock,
  Phone,
  Instagram,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  onOpenProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenProduct }) => {
  const { language, settings, products, setCurrentPage, generateWhatsappUrl } = useStore();
  const t = translations[language];

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);

  const categories = [
    {
      key: 'Gold Jewellery',
      titleEn: 'Gold Jewellery',
      titleHi: 'सोने के आभूषण',
      descEn: '22K BIS Hallmarked royal necklaces, kadas, and temple ornaments',
      descHi: '२२ कैरेट बीआईएस प्रमाणित हॉलमार्क हार, कंगन एवं पारंपरिक गहने',
      purity: '22K (916 BIS)',
      icon: Crown
    },
    {
      key: 'Silver Jewellery',
      titleEn: 'Silver Jewellery',
      titleHi: 'चांदी के आभूषण',
      descEn: 'Pure 925 sterling silver bridal payals, pooja thalis, and silverware',
      descHi: '९२५ शुद्ध स्टर्लिंग चांदी की दुल्हन पायल, पूजा थाली व बर्तन',
      purity: '92.5% Fine Silver',
      icon: Gem
    },
    {
      key: 'Bridal Jewellery',
      titleEn: 'Bridal Jewellery',
      titleHi: 'दुल्हन आभूषण',
      descEn: 'Regal bridal sets, polki aad, choker necklaces, and maang tikkas',
      descHi: 'शाही राजपूती आड़, पोलकी चोकर सेट, बोरला एवं दुल्हन सेट',
      purity: 'Heritage Bespoke',
      icon: Sparkles
    },
    {
      key: 'Rings',
      titleEn: 'Rings & Bands',
      titleHi: 'अंगूठियां',
      descEn: 'Certified solitaire diamond rings, gold bands, and signet rings',
      descHi: 'सॉलिटेयर हीरा अंगूठियां, सोने के छल्ले व शुभ नगीने',
      purity: '18K & 22K Gold',
      icon: Award
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#14213D]/60 via-black to-black border border-[#E5E4E2]/20 overflow-hidden p-6 sm:p-12 lg:p-16">
          
          {/* Subtle Golden Ambient Backdrop Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF75]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-2 text-xs text-[#D4AF75] font-semibold tracking-wider uppercase">
                <Crown className="w-4 h-4" />
                <span>{t.hero.kicker}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-tight max-w-2xl text-balance">
                {language === 'hi' ? t.hero.heading : 'Timeless Tradition. Exceptional Elegance.'}
              </h1>

              <p className="text-sm sm:text-base text-[#E5E4E2]/85 leading-relaxed max-w-xl">
                {language === 'hi' ? t.hero.subtitle : t.hero.subtitle}
              </p>

              {/* Verified Trust Markers */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#E5E4E2]/90 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF75]" />
                  <span>{language === 'hi' ? 'बीआईएस ९१६ हॉलमार्क' : 'BIS 916 Hallmarked Gold'}</span>
                </div>
                <span className="text-[#E5E4E2]/30" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5">
                  <Gem className="w-4 h-4 text-[#D4AF75]" />
                  <span>{language === 'hi' ? '९२५ शुद्ध चांदी' : '925 Sterling Silver'}</span>
                </div>
                <span className="text-[#E5E4E2]/30" aria-hidden="true">·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF75]" />
                  <span>{language === 'hi' ? 'पारदर्शी बिलिंग' : 'Transparent Valuation'}</span>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
                <button
                  onClick={() => setCurrentPage('collections')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#D4AF75] hover:bg-[#c49a55] text-[#0B0B0C] text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap min-touch-target"
                >
                  <span>{t.hero.exploreBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={generateWhatsappUrl(null)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap min-touch-target"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t.hero.whatsappBtn}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Prominent Display of the Official SBJ Logo Emblem */}
            <div className="lg:col-span-5 flex justify-center py-2 sm:py-0">
              <div className="relative group">
                {/* Decorative Platinum-toned border frame preserving the circular emblem with transparent background */}
                <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-tr from-[#14213D] via-[#E5E4E2]/30 to-[#D4AF75]/50 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-transparent p-1 flex items-center justify-center">
                    <img
                      src="/sbj-logo.png"
                      alt="Shree Bherunath Jewellers Official Emblem"
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Subtitle Badge */}
                <div className="text-center mt-4">
                  <span className="font-display text-sm tracking-wider uppercase text-[#E5E4E2]/90 block font-semibold">
                    {language === 'hi' ? settings.brandNameHi : settings.brandNameEn}
                  </span>
                  <span className="text-[11px] text-[#D4AF75] tracking-widest uppercase">
                    {language === 'hi' ? 'सोना एवं चांदी' : 'Gold & Silver Jewellery'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block mb-1">
              {language === 'hi' ? 'हस्तनिर्मित संग्रह' : 'Handcrafted Masterpieces'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {t.categories.title}
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('collections')}
            className="text-xs text-[#D4AF75] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'hi' ? 'सभी आभूषण देखें' : 'View All Collections'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                onClick={() => setCurrentPage('collections')}
                className="group cursor-pointer bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-xl p-6 hover:border-[#D4AF75]/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-black/60 border border-[#E5E4E2]/20 flex items-center justify-center text-[#D4AF75] mb-5 group-hover:border-[#D4AF75] transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-[#D4AF75] tracking-wider uppercase mb-1">
                  {cat.purity}
                </div>
                <h3 className="font-display text-lg font-semibold text-white group-hover:text-[#D4AF75] transition-colors mb-2">
                  {language === 'hi' ? cat.titleHi : cat.titleEn}
                </h3>
                <p className="text-xs text-[#E5E4E2]/75 leading-relaxed">
                  {language === 'hi' ? cat.descHi : cat.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Masterpieces Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block mb-1">
              {language === 'hi' ? 'विशिष्ट चयन' : 'Curated Highlights'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {language === 'hi' ? 'प्रमुख आभूषण कृतियां' : 'Featured Jewellery Ornaments'}
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('collections')}
            className="text-xs text-[#D4AF75] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'hi' ? 'पूरा कैटलॉग' : 'Explore Complete Catalog'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProduct}
            />
          ))}
        </div>
      </section>

      {/* Heritage & 4 Pillars of Trust */}
      <section className="bg-[#14213D]/40 border-y border-[#E5E4E2]/15 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block mb-1">
              {language === 'hi' ? 'हमारी विरासत एवं सिद्धांत' : 'Heritage & Hallmarking'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              {t.about.pillarsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed">
              {t.about.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black/50 border border-[#E5E4E2]/15 rounded-xl p-6 text-left">
              <ShieldCheck className="w-8 h-8 text-[#D4AF75] mb-4" />
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar1Title}
              </h3>
              <p className="text-xs text-[#E5E4E2]/75 leading-relaxed">
                {t.about.pillar1Desc}
              </p>
            </div>

            <div className="bg-black/50 border border-[#E5E4E2]/15 rounded-xl p-6 text-left">
              <Gem className="w-8 h-8 text-[#D4AF75] mb-4" />
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar2Title}
              </h3>
              <p className="text-xs text-[#E5E4E2]/75 leading-relaxed">
                {t.about.pillar2Desc}
              </p>
            </div>

            <div className="bg-black/50 border border-[#E5E4E2]/15 rounded-xl p-6 text-left">
              <Sparkles className="w-8 h-8 text-[#D4AF75] mb-4" />
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar3Title}
              </h3>
              <p className="text-xs text-[#E5E4E2]/75 leading-relaxed">
                {t.about.pillar3Desc}
              </p>
            </div>

            <div className="bg-black/50 border border-[#E5E4E2]/15 rounded-xl p-6 text-left">
              <Award className="w-8 h-8 text-[#D4AF75] mb-4" />
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar4Title}
              </h3>
              <p className="text-xs text-[#E5E4E2]/75 leading-relaxed">
                {t.about.pillar4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Store Location & Contact Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#14213D] border border-[#E5E4E2]/20 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block">
              {language === 'hi' ? 'शोरूम पर पधारें' : 'Visit Our Boutique'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {language === 'hi' ? 'व्यक्तिगत आभूषण परामर्श हेतु संपर्क करें' : 'Experience Our Creations in Person'}
            </h2>
            <p className="text-xs sm:text-sm text-[#E5E4E2]/85 max-w-2xl leading-relaxed">
              {language === 'hi' ? settings.addressHi : settings.addressEn}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#E5E4E2]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF75]" />
                <span>{language === 'hi' ? settings.openingHoursHi : settings.openingHoursEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF75]" />
                <span>{settings.phone}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-5 py-3 bg-[#D4AF75] hover:bg-[#c49a55] text-[#0B0B0C] text-xs font-semibold rounded-xl text-center transition-colors shadow flex items-center justify-center min-touch-target"
            >
              {t.contact.directionsBtn}
            </a>

            <a
              href={generateWhatsappUrl(null)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold rounded-xl text-center transition-colors shadow flex items-center justify-center gap-2 min-touch-target"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t.hero.whatsappBtn}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Official Instagram Preview Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border border-[#E5E4E2]/15 rounded-2xl p-6 sm:p-8 bg-black/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#14213D] border border-[#E5E4E2]/20 rounded-xl text-[#D4AF75]">
              <Instagram className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {t.instagram.title}
              </h3>
              <p className="text-xs text-[#E5E4E2]/70">
                {t.instagram.subtitle}
              </p>
            </div>
          </div>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#14213D] hover:bg-[#1f325c] border border-[#E5E4E2]/20 text-[#E5E4E2] hover:text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            {t.instagram.followBtn}
          </a>
        </div>
      </section>
    </div>
  );
};
