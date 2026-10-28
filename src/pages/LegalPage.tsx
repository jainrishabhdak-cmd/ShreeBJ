import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { Shield, FileText, Cookie, RotateCcw, Eye, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'cookie-policy' | 'refund-policy' | 'accessibility';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy' }) => {
  const { language, settings, setCurrentPage } = useStore();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const t = translations[language];

  const tabs = [
    { key: 'privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति', icon: Shield },
    { key: 'terms', labelEn: 'Terms & Conditions', labelHi: 'नियम एवं शर्तें', icon: FileText },
    { key: 'cookie-policy', labelEn: 'Cookie Policy', labelHi: 'कुकी नीति', icon: Cookie },
    { key: 'refund-policy', labelEn: 'Refund & Exchange', labelHi: 'वापसी एवं विनिमय', icon: RotateCcw },
    { key: 'accessibility', labelEn: 'Accessibility Statement', labelHi: 'सुलभता विवरण', icon: Eye }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center gap-1.5 text-xs text-[#D4AF75] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'मुखपृष्ठ पर लौटें' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#E5E4E2]/15 touch-scroll -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#D4AF75] text-[#000000] font-semibold shadow-md'
                  : 'bg-[#14213D] text-[#E5E4E2] hover:text-white border border-[#E5E4E2]/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-2xl p-6 sm:p-10 text-[#E5E4E2]/90 space-y-6 leading-relaxed text-xs sm:text-sm">
        
        {/* 1. Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-bold text-white">
              {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
            </h1>
            <p className="text-[11px] text-[#E5E4E2]/60">
              {language === 'hi' ? 'अंतिम संशोधन: अक्टूबर २०२६' : 'Last Updated: October 2026'} · {settings.brandNameEn}
            </p>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '१. परिचय एवं डेटा संग्रहण' : '1. Overview & Data Collection'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'श्री भेरूनाथ ज्वेलर्स ग्राहकों की गोपनीयता का पूर्ण सम्मान करता है। हम केवल वही न्यूनतम जानकारी एकत्रित करते हैं जो आप संपर्क फॉर्म या व्हाट्सएप पूछताछ के माध्यम से स्वेच्छा से हमें प्रदान करते हैं (उदा. आपका नाम, फोन नंबर, एवं आभूषण में रुचि)।'
                  : 'Shree Bherunath Jewellers is committed to upholding your privacy under the Indian Digital Personal Data Protection (DPDP) Act. We collect only necessary personal data voluntarily submitted through our enquiry forms or WhatsApp click-to-chat features, including your name, telephone number, and specific product preferences.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '२. डेटा का उपयोग एवं सुरक्षा' : '2. Purpose of Processing & Security'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'आपकी जानकारी केवल आपकी आभूषण पूछताछ का उत्तर देने, ऑर्डर की स्थिति बताने और शोरूम परामर्श हेतु उपयोग की जाती है। हम आपकी जानकारी कभी किसी तीसरे पक्ष को विपणन उद्देश्यों के लिए नहीं बेचते या साझा नहीं करते।'
                  : 'Your information is used solely to respond to jewellery inquiries, provide quotes based on current bullion rates, and coordinate custom bespoke commissions. We do not sell or monetize personal customer records to third-party advertisers.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '३. उपयोगकर्ता अधिकार' : '3. User Rights'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'आपको अपने डेटा की समीक्षा करने, सुधार करने या उसे हमारे रिकॉर्ड से हटाने का अनुरोध करने का पूरा अधिकार है। इसके लिए आप हमारे शोरूम से सीधे संपर्क कर सकते हैं।'
                  : 'You retain the right to review, rectify, or request deletion of personal enquiry logs stored by contacting our showroom administrator directly.'}
              </p>
            </section>
          </div>
        )}

        {/* 2. Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-bold text-white">
              {language === 'hi' ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions'}
            </h1>
            <p className="text-[11px] text-[#E5E4E2]/60">
              {language === 'hi' ? 'अंतिम संशोधन: अक्टूबर २०२६' : 'Last Updated: October 2026'} · {settings.brandNameEn}
            </p>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '१. बीआईएस हॉलमार्किंग एवं शुद्धता अनुपालन' : '1. BIS Hallmarking & Purity Compliance'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'श्री भेरूनाथ ज्वेलर्स द्वारा प्रदर्शित सभी स्वर्ण आभूषण भारतीय मानक ब्यूरो (BIS) के अनिवार्य हॉलमार्किंग नियमों के अनुरूप निर्मित और प्रमाणित होते हैं। प्रत्येक वस्तु पर आधिकारिक बीआईएस लोगो, कैरेट शुद्धता और विशिष्ट ६-अंकीय HUID लेजर कोड अंकित होता है।'
                  : 'All gold jewellery pieces displayed by Shree Bherunath Jewellers comply with Bureau of Indian Standards (BIS) Hallmarking Regulations. Each gold article is certified with the BIS Triangle, fineness purity mark, and a unique 6-digit laser-etched HUID code.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '२. मूल्य निर्धारण एवं बुलियन उतार-चढ़ाव' : '2. Valuation & Bullion Fluctuations'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'सोने और चांदी के भाव प्रतिदिन बाजार दरों के अनुसार बदलते हैं। वेबसाइट पर प्रदर्शित मानक दरें सांकेतिक हैं। किसी भी आभूषण का अंतिम बिलिंग मूल्य सटीक तौल, निर्माण शुल्क (मेकिंग चार्ज), रत्नों के वजन और भारत सरकार द्वारा निर्धारित ३% जीएसटी के आधार पर तय किया जाता है।'
                  : 'Precious metal rates fluctuate daily based on recognized bullion exchanges. Benchmark rates shown online are indicative. In-store billing strictly reflects gross and net weights, current metal rate, applicable making charges, gemstone costs, and statutory 3% Goods and Services Tax (GST).'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '३. बौद्धिक संपदा' : '3. Intellectual Property'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'श्री भेरूनाथ ज्वेलर्स (SBJ) का आधिकारिक लोगो, फोटोग्राफी, और ब्रांड पहचान हमारी अनन्य बौद्धिक संपदा हैं। पूर्व लिखित अनुमति के बिना इसका पुनरुत्पादन निषिद्ध है।'
                  : 'All brand insignia, the official circular SBJ emblem, photographs, and catalog texts are proprietary to Shree Bherunath Jewellers. Unauthorized duplication or scraping is strictly prohibited.'}
              </p>
            </section>
          </div>
        )}

        {/* 3. Cookie Policy */}
        {activeTab === 'cookie-policy' && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-bold text-white">
              {language === 'hi' ? 'कुकी नीति (Cookie Policy)' : 'Cookie Policy'}
            </h1>
            <p className="text-[11px] text-[#E5E4E2]/60">
              {language === 'hi' ? 'अंतिम संशोधन: अक्टूबर २०२६' : 'Last Updated: October 2026'} · {settings.brandNameEn}
            </p>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '१. हम कुकीज़ का उपयोग कैसे करते हैं' : '1. How We Use Cookies'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'हमारी वेबसाइट आपकी चुनी हुई भाषा (अंग्रेजी या हिन्दी), सुरक्षा सत्र, और आवश्यक ब्राउज़िंग प्राथमिकताओं को सुरक्षित रखने के लिए केवल न्यूनतम आवश्यक कुकीज़ और लोकल स्टोरेज का उपयोग करती है।'
                  : 'Our website strictly uses essential cookies and local storage tokens to preserve your language preference (EN or हिन्दी), protect against cross-site tampering, and maintain secure administrative sessions.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '२. तृतीय-पक्ष ट्रैकर्स की अनुपस्थिति' : '2. No Invasive Third-Party Tracking'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'हम किसी भी आक्रामक विज्ञापन ट्रैकर, व्यवहार ट्रैकिंग नेटवर्क, या तीसरे पक्ष के डेटा दलालों का उपयोग नहीं करते हैं।'
                  : 'We do not install invasive behavioral ad pixels, fingerprinting trackers, or sell analytics to external aggregators. You may clear your browser cookies at any time without impacting core catalog viewing.'}
              </p>
            </section>
          </div>
        )}

        {/* 4. Refund & Exchange Policy */}
        {activeTab === 'refund-policy' && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-bold text-white">
              {language === 'hi' ? 'वापसी एवं विनिमय नीति (Refund & Exchange)' : 'Refund, Return & Exchange Policy'}
            </h1>
            <p className="text-[11px] text-[#E5E4E2]/60">
              {language === 'hi' ? 'अंतिम संशोधन: अक्टूबर २०२६' : 'Last Updated: October 2026'} · {settings.brandNameEn}
            </p>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '१. स्वर्ण एवं रजत विनिमय व बायबैक' : '1. Precious Metal Buyback & Lifetime Exchange'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'हमारे द्वारा बेचे गए सभी बीआईएस हॉलमार्क २२ कैरेट व १८ कैरेट सोने के आभूषणों पर स्थायी विनिमय एवं बायबैक सुविधा उपलब्ध है। विनिमय के समय आभूषण की शुद्धता का इलेक्ट्रॉनिक कैरेटोमीटर द्वारा सटीक परीक्षण किया जाता है और उस दिन के सोने के भाव पर मूल्यांकन किया जाता है।'
                  : 'All BIS-hallmarked 22K and 18K gold items purchased from Shree Bherunath Jewellers are eligible for lifetime exchange and transparent buyback. Purity is verified using advanced electronic caratometers in your presence, and valuation is calculated transparently against the prevailing bullion benchmark rate.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '२. कस्टम निर्मित एवं ऑर्डर किए गए आभूषण' : '2. Bespoke & Made-to-Order Ornaments'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'ग्राहक की विशेष पसंद पर बनाए गए आभूषण (कस्टम मेड) पर कारीगर का विशेष समय और मेकिंग चार्ज लगता है। ऑर्डर रद्द करने की स्थिति में केवल अप्रयुक्त धातु का मूल्य वापस देय होगा।'
                  : 'Bespoke custom commissions crafted specifically to personal bridal specifications involve non-recoverable artisan casting and enameling labor. Cancellations prior to delivery are subject to actual labor cost retention while preserving 100% of the allocated bullion weight.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '३. मूल बिल एवं प्रमाण पत्र की अनिवार्यता' : '3. Requirement of Original Tax Invoice'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'किसी भी प्रकार के विनिमय, शुद्धता सत्यापन या सेवा हेतु मूल जीएसटी टैक्स बिल और प्रमाण पत्र प्रस्तुत करना आवश्यक है।'
                  : 'To initiate an exchange or servicing request, customers must present the original GST sales tax invoice and BIS hallmarking certification receipt issued at the time of purchase.'}
              </p>
            </section>
          </div>
        )}

        {/* 5. Accessibility Statement */}
        {activeTab === 'accessibility' && (
          <div className="space-y-5">
            <h1 className="font-display text-2xl font-bold text-white">
              {language === 'hi' ? 'सुलभता विवरण (Accessibility Statement)' : 'Accessibility Statement'}
            </h1>
            <p className="text-[11px] text-[#E5E4E2]/60">
              {language === 'hi' ? 'अंतिम संशोधन: अक्टूबर २०२६' : 'Last Updated: October 2026'} · {settings.brandNameEn}
            </p>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '१. WCAG २.२ AA मानक प्रतिबद्धता' : '1. Commitment to WCAG 2.2 AA Standards'}
              </h2>
              <p>
                {language === 'hi'
                  ? 'श्री भेरूनाथ ज्वेलर्स अपनी डिजिटल सेवाओं को सभी उपयोगकर्ताओं, जिनमें दिव्यांगजन भी शामिल हैं, के लिए समान रूप से सुलभ बनाने के लिए प्रतिबद्ध है। हमारी वेबसाइट वेब कंटेंट एक्सेसिबिलिटी गाइडलाइंस (WCAG 2.2 Level AA) के सिद्धांतों पर आधारित है।'
                  : 'Shree Bherunath Jewellers is committed to providing an inclusive digital showroom accessible to all visitors, including individuals with disabilities. Our platform is engineered targeting WCAG 2.2 Level AA compliance.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold text-white">
                {language === 'hi' ? '२. कार्यान्वित सुलभता सुविधाएं' : '2. Implemented Accessibility Features'}
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  {language === 'hi'
                    ? 'पूर्ण कीबोर्ड नेविगेशन और स्पष्ट दृश्य फोकस इंडिकेटर (:focus-visible)।'
                    : 'Full keyboard navigability with prominent high-contrast focus rings (:focus-visible).'}
                </li>
                <li>
                  {language === 'hi'
                    ? 'स्क्रीन रीडर उपयोगकर्ताओं के लिए वर्णनात्मक ARIA लेबल्स और सेमांटिक HTML5 टैग्स।'
                    : 'Semantic HTML5 structure and descriptive ARIA labels for screen readers.'}
                </li>
                <li>
                  {language === 'hi'
                    ? 'कम से कम ४.५:१ का टेक्स्ट कंट्रास्ट अनुपात और संतुलित टाइपोग्राफी।'
                    : 'Contrast ratios exceeding 4.5:1 against deep backgrounds for comfortable legibility.'}
                </li>
                <li>
                  {language === 'hi'
                    ? 'मोशन संवेदनशीलता वाले उपयोगकर्ताओं के लिए Reduced Motion सपोर्ट।'
                    : 'Respect for user operating system motion reduction preferences (prefers-reduced-motion).'}
                </li>
              </ul>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};
