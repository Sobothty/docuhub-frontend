'use client';

import { useTranslation } from 'react-i18next';

export function ContactHero() {
  const { t } = useTranslation('common');

  return (
    <section className="relative h-[90vh] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/contactUs/Herosection .jpg')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-hero-title text-white mb-6">
          {t('contact_us', { defaultValue: 'Contact Us' })}
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white">
          {t('contact-us_description', {
            defaultValue:
              'Have a question, suggestion, or need assistance? Fill out the form below and our team will get back to you promptly.',
          })}
        </p>
        <div>
          <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {t('get_in_touch', { defaultValue: 'Get in Touch' })}
          </button>
        </div>
      </div>
    </section>
  );
}
