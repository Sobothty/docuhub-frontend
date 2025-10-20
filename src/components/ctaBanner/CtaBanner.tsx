'use client';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const AdventureSection: FC = () => {
  const { t } = useTranslation('common'); // 'common' matches JSON file

  return (
    <section className="bg-dynamic overflow-visible my-0 py-24 mt-20">
      <div className="text-white items-center text-center flex flex-col">
        <h2 className="font-bold text-2xl lg:text-4xl">
          {t('adventureTitle')}
        </h2>
        <p className="mx-auto mt-6 max-w-7xl text-text-body-text md:text-xl leading-8 text-discription-color">
          {t('adventureDescription')}
        </p>
      </div>
    </section>
  );
};

export default AdventureSection;
