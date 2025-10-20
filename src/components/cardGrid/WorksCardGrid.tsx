'use client';

import React, { useState } from 'react';
import WorksCard from '@/components/card/WorksCard';
import { useTranslation } from 'react-i18next';

type UserType = 'Public User' | 'Student' | 'Adviser';

const WorksCardGrid: React.FC = () => {
  const { t } = useTranslation('common'); // Use your JSON namespace
  const [selectedUser, setSelectedUser] = useState<UserType>('Public User');

  const cardsData = {
    'Public User': [
      { title: t('pu_card1_title'), description: t('pu_card1_desc') },
      { title: t('pu_card2_title'), description: t('pu_card2_desc') },
      { title: t('pu_card3_title'), description: t('pu_card3_desc') },
      { title: t('pu_card4_title'), description: t('pu_card4_desc') },
    ],
    Student: [
      { title: t('student_card1_title'), description: t('student_card1_desc') },
      { title: t('student_card2_title'), description: t('student_card2_desc') },
      { title: t('student_card3_title'), description: t('student_card3_desc') },
      { title: t('student_card4_title'), description: t('student_card4_desc') },
    ],
    Adviser: [
      { title: t('adviser_card1_title'), description: t('adviser_card1_desc') },
      { title: t('adviser_card2_title'), description: t('adviser_card2_desc') },
      { title: t('adviser_card3_title'), description: t('adviser_card3_desc') },
      { title: t('adviser_card4_title'), description: t('adviser_card4_desc') },
    ],
  };

  const userIcons = [
    {
      type: 'Public User',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19" />
          <path d="M12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4" />
        </svg>
      ),
    },
    {
      type: 'Student',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m19 5l-7-3l-7 3l3.5 1.5v2S9.667 8 12 8s3.5.5 3.5.5v-2z" />
          <path d="m19 9l-3.5-1.5v1a3.5 3.5 0 1 1-7 0v-1m-.717 8.203c-1.1.685-3.986 2.082-2.229 3.831C6.413 21.39 7.37 22 8.571 22h6.858c1.202 0 2.158-.611 3.017-1.466c1.757-1.749-1.128-3.146-2.229-3.83a7.99 7.99 0 0 0-8.434 0" />
        </svg>
      ),
    },
    {
      type: 'Adviser',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 22l-2-6H2l2 6zm0 0h4" />
          <path d="M8 12.5v-.5c0-1.886 0-2.828-.586-3.414S9.886 8.5 8 8.5s-2.828 0-3.414.586S4 10.614 4 12.5v.5" />
          <circle cx="10" cy="4" r="2" />
          <circle cx="19" cy="13" r="2" />
          <path d="M14 17.5h6a2 2 0 0 1 2 2v.5a2 2 0 0 1-2 2h-1" />
        </svg>
      ),
    },
  ] as const;

  return (
    <section className="bg-background flex flex-col items-center my-10 md:my-20 gap-8">
      {/* Top Section: User Icons */}
      <h2 className="text-section-headings text-center mb-4">
        {t('how_it_works')}
      </h2>
      <div className="flex justify-center gap-10">
        {userIcons.map((user) => (
          <div
            key={user.type}
            onClick={() => setSelectedUser(user.type as UserType)}
            className={`flex flex-col items-center cursor-pointer transition transform ${
              selectedUser === user.type ? 'scale-110' : 'scale-100'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl mb-2 ${
                selectedUser === user.type
                  ? 'border-secondary text-secondary'
                  : 'border-text-dark text-text-dark'
              }`}
            >
              {user.icon}
            </div>
            <span className="text-gray-700 font-medium">{t(user.type)}</span>
          </div>
        ))}
      </div>

      {/* Bottom Section: Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardsData[selectedUser].map((card, index) => (
          <WorksCard
            key={index}
            title={card.title}
            description={card.description}
            index={index + 1}
            variant="hover" // 🔥 enable hover scale effect
          />
        ))}
      </div>
    </section>
  );
};

export default WorksCardGrid;
