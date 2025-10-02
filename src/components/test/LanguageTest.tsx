'use client';

import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function LanguageTest() {
  const { t, i18n } = useTranslation('common');

  return (
    <div className="p-6 bg-card rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Language Test</h2>
      <div className="space-y-3 mb-4">
        <p><strong>Current Language:</strong> {i18n.language}</p>
        <p><strong>Home:</strong> {t('home', 'Home')}</p>
        <p><strong>Browse:</strong> {t('browse', 'Browse')}</p>
        <p><strong>About:</strong> {t('about', 'About Us')}</p>
        <p><strong>Contact:</strong> {t('contact', 'Contact')}</p>
        <p><strong>Sign Up:</strong> {t('signup', 'Sign Up')}</p>
      </div>
      <div className="flex justify-center">
        <LanguageSwitcher />
      </div>
    </div>
  );
}