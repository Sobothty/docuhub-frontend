/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'kh'], // Add your languages—here English and Khmer
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
