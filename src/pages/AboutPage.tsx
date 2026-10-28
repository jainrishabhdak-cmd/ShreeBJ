import React from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { ShieldCheck, Gem, Sparkles, Scale, CheckCircle2, Award, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, settings } = useStore();
  const t = translations[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Brand Introduction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF75] tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? 'परंपरा और विश्वास' : 'Authentic Family Jewellers'}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {language === 'hi'
              ? `${settings.brandNameHi} — शुद्धता एवं कला का संगम`
              : `${settings.brandNameEn} — A Legacy of Sacred Purity & Craft`}
          </h1>

          <p className="text-sm sm:text-base text-[#E5E4E2]/85 leading-relaxed">
            {t.about.storyParagraph1}
          </p>

          <p className="text-sm sm:text-base text-[#E5E4E2]/85 leading-relaxed">
            {t.about.storyParagraph2}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#E5E4E2]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF75]" />
              <span>{language === 'hi' ? 'बीआईएस हॉलमार्क प्रमाणित' : 'BIS Hallmarked Gold'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#D4AF75]" />
              <span>{language === 'hi' ? '९२५ शुद्ध स्टर्लिंग चांदी' : '925 Fine Sterling Silver'}</span>
            </div>
          </div>
        </div>

        {/* Official Brand Emblem Display */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative p-2.5 sm:p-3 rounded-full bg-gradient-to-tr from-[#14213D] via-[#E5E4E2]/25 to-[#D4AF75]/40 shadow-2xl">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden bg-transparent p-2 flex items-center justify-center">
              <img
                src="/sbj-logo.png"
                alt="Shree Bherunath Jewellers Official Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Trust */}
      <section className="bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-2xl p-8 sm:p-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block mb-1">
            {language === 'hi' ? 'मूल सिद्धांत' : 'Foundational Principles'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.about.pillarsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start bg-black/40 border border-[#E5E4E2]/15 rounded-xl p-6">
            <div className="p-2.5 rounded-lg bg-[#14213D] text-[#D4AF75] shrink-0 border border-[#E5E4E2]/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar1Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed">
                {t.about.pillar1Desc}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-black/40 border border-[#E5E4E2]/15 rounded-xl p-6">
            <div className="p-2.5 rounded-lg bg-[#14213D] text-[#D4AF75] shrink-0 border border-[#E5E4E2]/10">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar2Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed">
                {t.about.pillar2Desc}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-black/40 border border-[#E5E4E2]/15 rounded-xl p-6">
            <div className="p-2.5 rounded-lg bg-[#14213D] text-[#D4AF75] shrink-0 border border-[#E5E4E2]/10">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar3Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed">
                {t.about.pillar3Desc}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-black/40 border border-[#E5E4E2]/15 rounded-xl p-6">
            <div className="p-2.5 rounded-lg bg-[#14213D] text-[#D4AF75] shrink-0 border border-[#E5E4E2]/10">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white mb-2">
                {t.about.pillar4Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed">
                {t.about.pillar4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hallmarking & Purity Verification Transparency */}
      <section className="border border-[#E5E4E2]/15 rounded-2xl p-8 sm:p-12 bg-black/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase block">
              {language === 'hi' ? 'भारतीय मानक ब्यूरो (BIS) दिशानिर्देश' : 'Bureau of Indian Standards Compliance'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {language === 'hi' ? 'सोने की शुद्धता की पहचान कैसे करें?' : 'How to Verify Your Gold Hallmark'}
            </h2>
            <p className="text-xs sm:text-sm text-[#E5E4E2]/85 leading-relaxed">
              {language === 'hi'
                ? 'भारत सरकार के नियमानुसार प्रत्येक हॉलमार्क सोने के आभूषण पर ३ अनिवार्य चिन्ह होते हैं: १. बीआईएस लोगो (त्रिकोण प्रतीक), २. शुद्धता ग्रेड (उदा. २२K९१६ या १८K७५०), एवं ३. विशिष्ट ६-अंकीय HUID (हॉलमार्क यूनिक आइडेंटिफिकेशन) कोड। ग्राहक भारत सरकार के आधिकारिक "BIS CARE" मोबाइल ऐप से किसी भी समय अपने आभूषण का HUID सत्यापित कर सकते हैं।'
                : 'Under Government of India regulations, every genuine hallmarked gold article features 3 mandatory marks: 1. The official BIS Triangle Logo, 2. The Purity Fineness Grade (e.g. 22K916 or 18K750), and 3. A unique 6-digit alphanumeric HUID (Hallmark Unique Identification) code. Customers can independently verify any HUID code via the Government of India BIS Care mobile application.'}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#14213D] border border-[#E5E4E2]/20 rounded-xl p-5 text-xs space-y-3">
            <div className="font-semibold text-[#D4AF75] text-sm">
              {language === 'hi' ? 'अनिवार्य हॉलमार्क प्रतीक:' : '3 Mandatory Hallmark Marks:'}
            </div>
            <div className="space-y-2 text-[#E5E4E2]/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>{language === 'hi' ? '१. आधिकारिक बीआईएस लोगो' : '1. Official BIS Standard Mark'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>{language === 'hi' ? '२. शुद्धता ग्रेड (२२K९१६ / १८K७५०)' : '2. Fineness (22K916 / 18K750)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>{language === 'hi' ? '३. ६-अंकीय विशिष्ट HUID कोड' : '3. 6-Digit Laser HUID Number'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
