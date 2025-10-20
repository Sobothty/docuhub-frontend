'use client';

import Image from 'next/image';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection: FC = () => {
  const { t, i18n } = useTranslation('common');

  // Language switcher handler
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <section className="h-[710px] bg-card px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base"
          aria-label="Select Language"
        >
          <option value="en">
            English
          </option>
          <option value="km">Khmer</option>
        </select>
      </div>

      {/* Left Content */}
      <div className="mt-20 max-w-xl lg:max-w-md ml-0 sm:ml-4 md:ml-8 lg:ml-20 text-center sm:text-left gap-10">
        <h1 className="text-hero-subtitle sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
          {t('hero_title', 'Discover, Share & Collaborate on Academic Excellence')}
        </h1>

        <p className="mb-4 sm:mb-6 text-foreground text-base sm:text-lg">
          <span className="text-secondary font-semibold">DocuHub</span>{' '}
          {t('hero_description', 'is your space for research and innovation. Explore papers, connect with experts, and showcase your work globally.')}
        </p>

        <p className="italic text-foreground text-base sm:text-lg flex flex-col sm:flex-row items-center">
          {t('hero_quote', "Knowledge grows when it's shared.")}{' '}
          <span
            className="text-orange-500 text-xl sm:text-2xl align-middle"
            aria-label="quote"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="46"
              viewBox="0 0 16 16"
              className="-scale-x-100 text-accent dark:text-accent"
            >
              <path
                fill="currentColor"
                d="M6.848 2.47a1 1 0 0 1-.318 1.378A7.3 7.3 0 0 0 3.75 7.01A3 3 0 1 1 1 10v-.027a4 4 0 0 1 .01-.232c.009-.15.027-.36.062-.618c.07-.513.207-1.22.484-2.014c.552-1.59 1.67-3.555 3.914-4.957a1 1 0 0 1 1.378.318m7 0a1 1 0 0 1-.318 1.378a7.3 7.3 0 0 0-2.78 3.162A3 3 0 1 1 8 10v-.027a4 4 0 0 1 .01-.232c.009-.15.027-.36.062-.618c.07-.513.207-1.22.484-2.014c.552-1.59 1.67-3.555 3.914-4.957a1 1 0 0 1 1.378.318"
              />
            </svg>
          </span>
        </p>
      </div>

      {/* Right Image and Badges */}
      <div className="relative mt-6 sm:mt-8 md:mt-12 lg:mt-0 flex-shrink-0 w-60 sm:w-72 md:w-80 lg:w-[480px] h-60 sm:h-72 md:h-80 lg:h-[480px] flex justify-center items-center">
        {/* Blue circle background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-500 to-blue-900 opacity-90" />

        {/* Person Image inside circle */}
        <Image
          src="/hero-section/hero-section-image.png"
          alt={t('hero_image_alt', 'Person holding laptop')}
          width={480}
          height={480}
          className="rounded-full object-cover relative z-10 -top-10 sm:-top-16 md:-top-20"
          priority
        />

        {/* Research Documents Badge */}
        <div className="absolute top-4/5 sm:top-2/3 md:top-70 -left-16 sm:-left-20 md:-left-40 bg-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 flex items-center space-x-2 sm:space-x-3 max-w-xs sm:max-w-sm md:max-w-xs shadow-lg z-20">
          <div className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/hero-section/Ellipse20.png"
              alt={t('research_docs_alt', 'Research Docs icon')}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="text-white">
            <p className="font-bold text-base sm:text-lg">980k+</p>
            <p className="text-sm sm:text-base font-medium">
              {t('research_docs_label', 'Research Documents')}
            </p>
          </div>
        </div>

        {/* Happy Students Badge */}
        <div className="absolute top-1 sm:top-12 md:top-12 -right-20 sm:-right-16 md:-right-16 bg-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 flex items-center space-x-2 sm:space-x-3 max-w-xs sm:max-w-sm md:max-w-xs shadow-lg z-20">
          <div className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 rounded-full overflow-hidden">
            <Image
              src="https://as1.ftcdn.net/jpg/01/65/06/10/1000_F_165061057_4zWzz1Ev99pR2Vib9PLrpAohKMWNRkKM.jpg"
              alt={t('happy_students_alt', 'Happy Students')}
              width={40}
              height={40}
              className="object-cover scale-160"
            />
          </div>
          <div className="text-white">
            <p className="font-bold text-base sm:text-lg">980k+</p>
            <p className="text-sm sm:text-base font-medium">
              {t('happy_students_label', 'Happy Students')}
            </p>
          </div>
        </div>

        {/* Decorative Icons */}
        {/* Document Icon */}
        <svg
          className="absolute top-2 sm:top-10 md:top-10 left-1 sm:left-2 md:left-2 w-6 sm:w-8 md:w-8 h-6 sm:h-8 md:h-8 stroke-blue-600 z-0"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="9" y2="9" />
        </svg>

        {/* Graduation cap icon */}
        <svg
          className="absolute top-8 sm:top-16 md:top-16 right-2 sm:right-10 md:right-20 w-6 sm:w-8 md:w-8 h-6 sm:h-8 md:h-8 stroke-blue-600 z-0"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M22 10L12 15 2 10l10-5 10 5z" />
          <path d="M12 15v7" />
          <path d="M7 21h10" />
        </svg>

        {/* Book icon */}
        <svg
          className="absolute bottom-2 sm:bottom-12 md:bottom-12 left-1 sm:left-2 md:left-2 w-6 sm:w-10 md:w-10 h-6 sm:h-10 md:h-10 stroke-blue-600 z-0"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H18" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H18v10H6.5A2.5 2.5 0 0 1 4 14.5z" />
        </svg>

        {/* WhatsApp icon */}
        <svg
          className="absolute bottom-2 sm:bottom-6 md:bottom-6 right-2 sm:right-6 md:right-6 w-6 sm:w-8 md:w-8 h-6 sm:h-8 md:h-8 fill-blue-600 cursor-pointer z-0"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.007-.371-.009-.57-.009-.198 0-.52.074-.792.373s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.711.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347z" />
          <path d="M20.52 3.48A11.883 11.883 0 0 0 12 0C5.377 0 0 5.377 0 12c0 2.115.552 4.099 1.518 5.865L0 24l6.327-1.63a11.893 11.893 0 0 0 5.66 1.424c6.623 0 12-5.377 12-12 0-3.2-1.247-6.202-3.48-8.52zM12 21.6a9.59 9.59 0 0 1-4.859-1.429l-.348-.207-3.75.966.995-3.651-.226-.374A9.604 9.604 0 0 1 2.4 12c0-5.313 4.287-9.6 9.6-9.6 2.566 0 4.978 1 6.785 2.814a9.54 9.54 0 0 1 2.816 6.786c0 5.313-4.288 9.6-9.6 9.6z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
