import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import {
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Clock,
  Send,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, settings, generateWhatsappUrl } = useStore();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productInterest: 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState<{
    submitting: boolean;
    success?: string;
    error?: string;
  }>({ submitting: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitting: true });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setStatus({
            submitting: false,
            error: language === 'hi'
              ? 'अनुरोध सीमा पार हो गई है (१० प्रति मिनट)। कृपया कुछ क्षण बाद पुनः प्रयास करें।'
              : 'Rate limit reached (10 requests/minute). Please wait a moment before sending another message.'
          });
        } else {
          setStatus({
            submitting: false,
            error: data.error || t.contact.errorMsg
          });
        }
        return;
      }

      setStatus({
        submitting: false,
        success: language === 'hi' ? data.messageHi : data.messageEn
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        productInterest: 'General Inquiry',
        message: ''
      });
    } catch {
      setStatus({
        submitting: false,
        error: t.contact.errorMsg
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-[#D4AF75] tracking-wider uppercase">
          {language === 'hi' ? 'सीधा संपर्क' : 'Verified Showroom & Inquiries'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          {t.contact.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#E5E4E2]/80 leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Direct Contact Info & Maps */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#14213D] border border-[#E5E4E2]/20 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-black text-[#D4AF75] shrink-0 border border-[#E5E4E2]/15">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white mb-1">
                  {t.contact.addressTitle}
                </h3>
                <p className="text-xs text-[#E5E4E2]/85 leading-relaxed">
                  {language === 'hi' ? settings.addressHi : settings.addressEn}
                </p>
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#D4AF75] hover:underline"
                >
                  <span>{t.contact.directionsBtn}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Telephone */}
            <div className="flex items-start gap-4 pt-2 border-t border-[#E5E4E2]/10">
              <div className="p-2.5 rounded-lg bg-black text-[#D4AF75] shrink-0 border border-[#E5E4E2]/15">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white mb-1">
                  {t.contact.phoneTitle}
                </h3>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-xs font-mono font-semibold text-[#D4AF75] hover:underline block"
                >
                  {settings.phone}
                </a>
                <span className="text-[11px] text-[#E5E4E2]/60">
                  {language === 'hi' ? 'शोरूम समय में कॉल करें' : 'Available during showroom hours'}
                </span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4 pt-2 border-t border-[#E5E4E2]/10">
              <div className="p-2.5 rounded-lg bg-black text-[#25D366] shrink-0 border border-[#E5E4E2]/15">
                <MessageCircle className="w-5 h-5 fill-[#25D366]" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white mb-1">
                  {t.contact.whatsappTitle}
                </h3>
                <a
                  href={generateWhatsappUrl(null)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] font-medium hover:underline block"
                >
                  +{settings.whatsappNumber}
                </a>
                <span className="text-[11px] text-[#E5E4E2]/60">
                  {language === 'hi' ? 'सीधे चैट में आभूषण विवरण पूछें' : 'Instant enquiry & custom bespoke advice'}
                </span>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-4 pt-2 border-t border-[#E5E4E2]/10">
              <div className="p-2.5 rounded-lg bg-black text-[#D4AF75] shrink-0 border border-[#E5E4E2]/15">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white mb-1">
                  {t.contact.instagramTitle}
                </h3>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D4AF75] hover:underline block"
                >
                  @s_b_j_silver_hub
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-4 pt-2 border-t border-[#E5E4E2]/10">
              <div className="p-2.5 rounded-lg bg-black text-[#D4AF75] shrink-0 border border-[#E5E4E2]/15">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white mb-1">
                  {t.contact.hoursTitle}
                </h3>
                <p className="text-xs text-[#E5E4E2]/80">
                  {language === 'hi' ? settings.openingHoursHi : settings.openingHoursEn}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Secure Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#14213D]/50 border border-[#E5E4E2]/20 rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white mb-1">
              {t.contact.formTitle}
            </h2>
            <p className="text-xs text-[#E5E4E2]/70 mb-6">
              {t.contact.formSubtitle}
            </p>

            {status.success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{status.success}</p>
              </div>
            )}

            {status.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{status.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#E5E4E2]/90 mb-1.5">
                    {t.contact.nameLabel} <span className="text-[#D4AF75]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'hi' ? 'आपका पूरा नाम' : 'e.g. Ramesh Sharma'}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-lg px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder-[#E5E4E2]/40 focus:border-[#D4AF75] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E5E4E2]/90 mb-1.5">
                    {t.contact.phoneLabel} <span className="text-[#D4AF75]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={20}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={language === 'hi' ? 'उदा. +91 88500 32920' : '+91 88500 32920'}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-lg px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder-[#E5E4E2]/40 focus:border-[#D4AF75] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#E5E4E2]/90 mb-1.5">
                    {t.contact.emailLabel}
                  </label>
                  <input
                    type="email"
                    maxLength={100}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-lg px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder-[#E5E4E2]/40 focus:border-[#D4AF75] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E5E4E2]/90 mb-1.5">
                    {t.contact.productInterestLabel}
                  </label>
                  <select
                    value={formData.productInterest}
                    onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-lg px-3.5 py-3 sm:py-2.5 text-base sm:text-xs text-white focus:border-[#D4AF75] focus:outline-none"
                  >
                    <option value="General Inquiry">{language === 'hi' ? 'सामान्य पूछताछ' : 'General Inquiry'}</option>
                    <option value="Bridal Jewellery">{language === 'hi' ? 'दुल्हन आभूषण सेट' : 'Bridal Jewellery Sets'}</option>
                    <option value="Gold Jewellery">{language === 'hi' ? 'सोने के आभूषण' : 'Gold Jewellery'}</option>
                    <option value="Silver Jewellery">{language === 'hi' ? 'चांदी के आभूषण व पूजा सामग्री' : 'Silver Jewellery & Pooja Articles'}</option>
                    <option value="Bespoke Custom Making">{language === 'hi' ? 'कस्टम आभूषण निर्माण' : 'Bespoke Custom Making'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E5E4E2]/90 mb-1.5">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    language === 'hi'
                      ? 'कृपया अपनी आवश्यकता, वजन या विशिष्ट डिजाइन का विवरण यहाँ लिखें...'
                      : 'Share your specific requirements, desired weight, or questions here...'
                  }
                  className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-lg p-3.5 text-base sm:text-xs text-white placeholder-[#E5E4E2]/40 focus:border-[#D4AF75] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-[#E5E4E2]/50 text-center sm:text-left">
                  {language === 'hi' ? 'सुरक्षित एवं गोपनीय सम्प्रेषण' : 'Secure & spam-protected submission'}
                </span>

                <button
                  type="submit"
                  disabled={status.submitting}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#D4AF75] hover:bg-[#c49a55] disabled:opacity-50 text-[#0B0B0C] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 min-touch-target shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{status.submitting ? t.contact.sendingBtn : t.contact.submitBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
