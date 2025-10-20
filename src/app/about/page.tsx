'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { motion, useScroll } from 'motion/react';

export default function AboutUsPage() {
  const { t } = useTranslation('common');
  const {scrollYProgress} = useScroll();
  // Team members data
  const teamMembers = [
    {
      id: 1,
      nameKey: 'team_member_1_name',
      roleKey: 'team_member_1_role',
      image: '/memberTeam/BUTSEAVTHONG.jpg',
      socialLinks: [
        {
          name: 'GitHub',
          icon: 'github',
          url: 'https://github.com/ButSeavThong',
        },
        { name: 'Email', icon: 'email', url: 'mailto:tong24772@gmail.com' },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/thong-fazon-8a113a37a',
        },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/ThongFazon' },
      ],
    },
    {
      id: 2,
      nameKey: 'team_member_2_name',
      roleKey: 'team_member_2_role',
      image: '/memberTeam/KrySobothty.JPG',
      socialLinks: [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/Sobothty' },
        { name: 'Email', icon: 'email', url: 'mailto:sobothty@gmail.com' },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/kry-sobothty-1656712a9',
        },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/isSobothty' },
      ],
    },
    {
      id: 3,
      nameKey: 'team_member_3_name',
      roleKey: 'team_member_3_role',
      image: '/memberTeam/ChimTheara.JPG',
      socialLinks: [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/theara24' },
        { name: 'Email', icon: 'email', url: 'mailto:chimtheara93@gmail.com' },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/theara-chim-971845341/',
        },
        { name: 'Telegram', icon: 'telegram', url: 'https://@chim_theara' },
      ],
    },
    {
      id: 4,
      nameKey: 'team_member_4_name',
      roleKey: 'team_member_4_role',
      image: '/memberTeam/PengSeangSim.JPG',
      socialLinks: [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/seang454' },
        {
          name: 'Email',
          icon: 'email',
          url: 'mailto:pengseangsim210@gmail.com',
        },
        { name: 'LinkedIn', icon: 'linkedin', url: '#' },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/pengseang12' },
      ],
    },
    {
      id: 5,
      nameKey: 'team_member_5_name',
      roleKey: 'team_member_5_role',
      image: '/memberTeam/SornSophamarinet.JPG',
      socialLinks: [
        {
          name: 'GitHub',
          icon: 'github',
          url: 'https://github.com/Sorn-Sophamarinet',
        },
        { name: 'Email', icon: 'email', url: 'mailto:netsorn7777@gmail.com' },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/sorn-sophamarinet-8a4a4133a/',
        },
        {
          name: 'Telegram',
          icon: 'telegram',
          url: 'https://t.me/Sophamarinet_Sorn',
        },
      ],
    },
    {
      id: 6,
      nameKey: 'team_member_6_name',
      roleKey: 'team_member_6_role',
      image: '/memberTeam/KHIMSOKHA.jpg',
      socialLinks: [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/Khaagic' },
        { name: 'Email', icon: 'email', url: '#' },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/khim-sokha-529b20373?',
        },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/Khaagic' },
      ],
    },
    {
      id: 7,
      nameKey: 'team_member_7_name',
      roleKey: 'team_member_7_role',
      image: '/memberTeam/PhoHongleap.JPG',
      socialLinks: [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/hongleap' },
        { name: 'Email', icon: 'email', url: 'mailto:hongleap0000@gmail.com' },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/pho-hongleap-14abb5342/',
        },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/Phohongleap' },
      ],
    },
    {
      id: 8,
      nameKey: 'team_member_8_name',
      roleKey: 'team_member_8_role',
      image: '/memberTeam/VannarithVr.JPG',
      socialLinks: [
        {
          name: 'GitHub',
          icon: 'github',
          url: 'https://github.com/vannarith10',
        },
        {
          name: 'Email',
          icon: 'email',
          url: 'mailto:vyra.vannarith27@gmail.com',
        },
        {
          name: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com/in/vyra-vannarith-7604a6333',
        },
        {
          name: 'Telegram',
          icon: 'telegram',
          url: 'https://t.me/vannarith_vr',
        },
      ],
    },
  ];

  // Mentors data
  const mentors = [
    {
      id: 1,
      nameKey: 'mentor_1_name',
      roleKey: 'mentor_1_role',
      image: '/mentor/KimChansokpheng.jpg',
      socialLinks: [
        {
          name: 'GitHub',
          icon: 'github',
          url: 'https://github.com/sokpheng001',
        },
        {
          name: 'Email',
          icon: 'email',
          url: 'mailto:kimchansokpheng123@gmail.com',
        },
        { name: 'LinkedIn', icon: 'linkedin', url: '#' },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/sokpheng001' },
      ],
    },
    {
      id: 2,
      nameKey: 'mentor_2_name',
      roleKey: 'mentor_2_role',
      image: '/mentor/EungLyzhia.JPG',
      socialLinks: [
        { name: 'GitHub', icon: 'github', url: 'https://github.com/lyzhiaa' },
        { name: 'Email', icon: 'email', url: 'mailto:lyzhiaeung@gmail.com' },
        { name: 'LinkedIn', icon: 'linkedin', url: '#' },
        { name: 'Telegram', icon: 'telegram', url: 'https://t.me/lyzhia' },
      ],
    },
  ];

  // Social media icon component
  const SocialIcon = ({ icon, url }: { icon: string; url: string }) => {
    const getIcon = () => {
      switch (icon) {
        case 'github':
          return (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 4.624-5.479 4.862.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          );
        case 'email':
          return (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 640 640"
            >
              <path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
            </svg>
          );
        case 'linkedin':
          return (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          );
        case 'telegram':
          return (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <a
        href={url}
        className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
      >
        {getIcon()}
      </a>
    );
  };

  return (
    <>
    <motion.div
                    id="scroll-indicator"
                    style={{
                        scaleX: scrollYProgress,
                        position: "fixed",
                        top: 128,
                        left: 0,
                        right: 0,
                        height: 5,
                        originX: 0,
                        backgroundColor: "#f59e0b",
                        zIndex: 9999,
                    }}
                />
    <div className="min-h-screen">
      {/* About Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/img/aboutUs.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-hero-title text-white mb-6">
            {t('about_us', { defaultValue: 'About Us' })}
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white">
            {t('about_us_description', {
              defaultValue:
                'DocuHub is your trusted platform for discovering academic documents, sharing your work, and connecting with mentors — all in one place.',
            })}
          </p>
          <div>
            <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              {t('see_more', { defaultValue: 'See more' })}
            </button>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 px-6 bg-background">
        <div className="text-center md:mb-6 lg:mb-12">
          <h1 className="text-3xl font-bold text-foreground dark:card dark:px-6 dark:py-4 dark:rounded-lg dark:mx-auto dark:max-w-4xl dark:text-center">
            {t('about_us', { defaultValue: 'About Us' })}
          </h1>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-12 p-10 items-center">
            <div>
              <h2 className="text-section-headings text-center mb-6 text-text-section-headings dark:px-6 dark:py-4 dark:rounded-lg dark:max-w-2xl">
                {t('vision_title', {
                  defaultValue: 'The Vision Behind DocuHub',
                })}
              </h2>
              <p className="md:text-md lg:text-body-text text-foreground dark:text-descript-1 font-bold mb-2 md:mb-3 lg:mb-6 leading-relaxed transition-colors duration-300 line-clamp-2 md:line-clamp-3 lg:line-clamp-none">
                {t('vision_description_1', {
                  defaultValue:
                    'DocuHub was created with a simple but powerful vision — to make high-quality academic resources available to all.',
                })}
              </p>
              <p className="text-sm md:text-md lg:text-body-text text-gray-500 dark:text-descript font-bold leading-relaxed transition-colors duration-300 line-clamp-2 md:line-clamp-3 lg:line-clamp-none">
                {t('vision_description_2', {
                  defaultValue:
                    'DocuHub bridges the gap by curating an extensive repository of thousands of scholarly papers, journals, datasets, and educational tools, all centralized in one intuitive platform.',
                })}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative group" id="mouse-follow-container">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500 rounded-tl-2xl z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent rounded-br-2xl z-0"></div>
                <div className="relative bg-card rounded-lg shadow-lg p-4 max-w-md z-10 animate-float">
                  <Image
                    src="https://www.cstad.edu.kh/_next/image?url=https%3A%2F%2Flms-api.istad.co%2Fapi%2Fv1%2Fmedias%2Fview%2F6a4e078a-b8d0-46d6-ada4-a9565c328b92.png&w=1920&q=75"
                    alt={t('vision_image_alt', {
                      defaultValue: 'Main content image',
                    })}
                    width={400}
                    height={300}
                    className="rounded-lg w-full"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                    <div className="particle particle-5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-10 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-25 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <div>
                <Image
                  src="/img/ourhistory.jpg"
                  alt={t('history_image_alt', {
                    defaultValue: 'How it all started illustration',
                  })}
                  width={600}
                  height={400}
                  className="rounded-lg max-w-xl w-full h-90 object-cover"
                  priority
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block bg-accent hover:bg-[#D97706] text-white px-4 py-2 rounded-full text-small-text font-semibold mb-4">
                {t('our_story', { defaultValue: 'Our Story' })}
              </div>
              <h2 className="text-section-headings mb-6 dark:px-6 dark:py-4 dark:rounded-lg items-start dark:max-w-2xl">
                {t('how_it_started', { defaultValue: 'How It All Started' })}
              </h2>
              <p className="text-body-text text-foreground leading-relaxed mb-8 transition-colors duration-300">
                {t('history_description', {
                  defaultValue:
                    'We started DocuHub to transform how academic knowledge is shared. Students, mentors, and researchers struggled with scattered papers and slow feedback, so we built one hub where every paper and idea can find its audience.',
                })}
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-accent dark:text-accent">
                  {t('mission_title', { defaultValue: 'Our mission is to:' })}
                </h3>
              </div>
              <ul className="space-y-4 text-dark dark:text-descript transition-colors duration-300">
                <li className="flex items-start gap-3">
                  <div className="rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-accent dark:text-accent"
                      fill="currentColor"
                      viewBox="0 0 640 640"
                    >
                      <path d="M64 96C46.3 96 32 110.3 32 128C32 145.7 46.3 160 64 160L72 160L72 224L32 224L32 336C69.6 345.4 96 379.2 96 418L96 512C96 529.7 110.3 544 128 544L160 544C177.7 544 192 529.7 192 512L192 448C192 395 235 352 288 352C294.4 352 300.7 352.6 306.7 353.8C341.4 304.3 398.9 272 464 272C492.6 272 519.6 278.2 544 289.4L544 224L504 224L504 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L64 96zM456 160L456 224L376 224L376 160L456 160zM328 160L328 224L248 224L248 160L328 160zM120 160L200 160L200 224L120 224L120 160zM608 464C608 384.5 543.5 320 464 320C384.5 320 320 384.5 320 464C320 543.5 384.5 608 464 608C543.5 608 608 543.5 608 464zM521.4 403.1C528.5 408.3 530.1 418.3 524.9 425.4L460.9 513.4C458.1 517.2 453.9 519.6 449.2 519.9C444.5 520.2 439.9 518.6 436.6 515.3L396.6 475.3C390.4 469.1 390.4 458.9 396.6 452.7C402.8 446.5 413 446.5 419.2 452.7L446 479.5L499 406.6C504.2 399.5 514.2 397.9 521.4 403.1z" />
                    </svg>
                  </div>
                  <span className="text-body-text text-gray-500 dark:text-dark font-bold transition-colors duration-300">
                    {t('mission_1', {
                      defaultValue:
                        'Bridge the gap between knowledge creators and seekers.',
                    })}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-accent dark:text-accent"
                      fill="currentColor"
                      viewBox="0 0 640 640"
                    >
                      <path d="M415.9 344L225 344C227.9 408.5 242.2 467.9 262.5 511.4C273.9 535.9 286.2 553.2 297.6 563.8C308.8 574.3 316.5 576 320.5 576C324.5 576 332.2 574.3 343.4 563.8C354.8 553.2 367.1 535.8 378.5 511.4C398.8 467.9 413.1 408.5 416 344zM224.9 296L415.8 296C413 231.5 398.7 172.1 378.4 128.6C367 104.2 354.7 86.8 343.3 76.2C332.1 65.7 324.4 64 320.4 64C316.4 64 308.7 65.7 297.5 76.2C286.1 86.8 273.8 104.2 262.4 128.6C242.1 172.1 227.8 231.5 224.9 296zM176.9 296C180.4 210.4 202.5 130.9 234.8 78.7C142.7 111.3 74.9 195.2 65.5 296L176.9 296zM65.5 344C74.9 444.8 142.7 528.7 234.8 561.3C202.5 509.1 180.4 429.6 176.9 344L65.5 344zM463.9 344C460.4 429.6 438.3 509.1 406 561.3C498.1 528.6 565.9 444.8 575.3 344L463.9 344zM575.3 296C565.9 195.2 498.1 111.3 406 78.7C438.3 130.9 460.4 210.4 463.9 296L575.3 296z" />
                    </svg>
                  </div>
                  <span className="text-body-text text-gray-500 dark:text-dark font-bold transition-colors duration-300">
                    {t('mission_2', {
                      defaultValue:
                        'Make academic resources accessible to everyone, anytime, anywhere.',
                    })}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-accent dark:text-accent"
                      fill="currentColor"
                      viewBox="0 0 640 640"
                    >
                      <path d="M320 64C355.3 64 384 92.7 384 128C384 163.3 355.3 192 320 192C284.7 192 256 163.3 256 128C256 92.7 284.7 64 320 64zM416 376C416 401 403.3 423 384 435.9L384 528C384 554.5 362.5 576 336 576L304 576C277.5 576 256 554.5 256 528L256 435.9C236.7 423 224 401 224 376L224 336C224 283 267 240 320 240C373 240 416 283 416 336L416 376zM160 96C190.9 96 216 121.1 216 152C216 182.9 190.9 208 160 208C129.1 208 104 182.9 104 152C104 121.1 129.1 96 160 96zM176 336L176 368C176 400.5 188.1 430.1 208 452.7L208 528C208 529.2 208 530.5 208.1 531.7C199.6 539.3 188.4 544 176 544L144 544C117.5 544 96 522.5 96 496L96 439.4C76.9 428.4 64 407.7 64 384L64 352C64 299 107 256 160 256C172.7 256 184.8 258.5 195.9 262.9C183.3 284.3 176 309.3 176 336zM432 528L432 452.7C451.9 430.2 464 400.5 464 368L464 336C464 309.3 456.7 284.4 444.1 262.9C455.2 258.4 467.3 256 480 256C533 256 576 299 576 352L576 384C576 407.7 563.1 428.4 544 439.4L544 496C544 522.5 522.5 544 496 544L464 544C451.7 544 440.4 539.4 431.9 531.7C431.9 530.5 432 529.2 432 528zM480 96C510.9 96 536 121.1 536 152C536 182.9 510.9 208 480 208C449.1 208 424 182.9 424 152C424 121.1 449.1 96 480 96z" />
                    </svg>
                  </div>
                  <span className="text-body-text text-gray-500 dark:text-dark font-bold transition-colors duration-300">
                    {t('mission_3', {
                      defaultValue:
                        'Foster collaboration and innovation in research and learning.',
                    })}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="zoom-out-left">
              <div className="inline-block bg-accent hover:bg-[#D97706] text-white px-4 py-2 rounded-full text-small-text font-semibold mb-4">
                {t('our_values', { defaultValue: 'Our Values' })}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground dark:bg-background dark:px-6 dark:py-4 dark:rounded-lg dark:max-w-2xl">
                {t('what_we_stand_for', { defaultValue: 'What We Stand For' })}
              </h2>
              <p className="text-body-text text-foreground dark:text-descript-1 leading-relaxed mb-8 transition-colors duration-300">
                {t('values_description', {
                  defaultValue:
                    'We started DocuHub to transform how academic knowledge is shared. Students, mentors, and researchers struggled with scattered papers and slow feedback, so we built one hub where every paper and idea can find its audience.',
                })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-accent dark:text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                    <h3 className="text-buttons text-foreground transition-colors duration-300">
                      {t('collaboration', { defaultValue: 'Collaboration' })}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-descipt text-small-text transition-colors duration-300">
                    {t('collaboration_description', {
                      defaultValue: 'We believe knowledge grows when shared.',
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-accent dark:text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-buttons text-foreground transition-colors duration-300">
                      {t('quality', { defaultValue: 'Quality' })}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-descipt text-small-text font-bold transition-colors duration-300">
                    {t('quality_description', {
                      defaultValue:
                        'We ensure papers meet high standards before publication.',
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-accent dark:text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-buttons text-foreground transition-colors duration-300">
                      {t('accessibility', { defaultValue: 'Accessibility' })}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-descipt text-small-text font-bold transition-colors duration-300">
                    {t('accessibility_description', {
                      defaultValue:
                        'Everyone should have access to learning resources.',
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-accent dark:text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.533 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.533 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-buttons text-foreground transition-colors duration-300">
                      {t('innovation', { defaultValue: 'Innovation' })}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-descipt text-small-text font-bold transition-colors duration-300">
                    {t('innovation_description', {
                      defaultValue:
                        'We keep improving our tools to serve you better.',
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center relative">
              <div className="animate-float">
                <Image
                  src="/img/westand.jpg"
                  alt={t('values_image_alt', {
                    defaultValue: 'Our Values illustration',
                  })}
                  width={600}
                  height={400}
                  className="rounded-lg max-w-lg w-full h-auto"
                  priority
                />
                <div className="absolute bottom-4 right-4 bg-card rounded-lg shadow-lg p-3 flex items-center gap-2 transition-colors duration-300">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      {t('finished', { defaultValue: 'Finished' })}
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      {t('tasks', {
                        defaultValue: '{{count}} tasks',
                        count: 18,
                      })}{' '}
                      <span className="text-green-500">+8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-10 px-6 bg-background relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-section-headings font-bold text-center mb-12 text-foreground">
            {t('who_we_serve', { defaultValue: 'Who We Serve' })}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 text-center transition-colors duration-300">
              <div className="rounded-full flex text-center items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-10 h-10 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-subheadings font-bold mb-3 text-center text-foreground transition-colors duration-300">
                {t('public_users', { defaultValue: 'Public Users' })}
              </h3>
              <p className="text-footer-links text-center text-descript-color transition-colors duration-300">
                {t('public_users_description', {
                  defaultValue:
                    'Access thousands of academic papers, and resources in one place.',
                })}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 transition-colors duration-300">
              <div className="rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-10 h-10 text-accent"
                  fill="currentColor"
                  viewBox="0 0 640 640"
                >
                  <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4z" />
                </svg>
              </div>
              <h3 className="text-subheadings font-bold mb-3 text-center text-foreground transition-colors duration-300">
                {t('student', { defaultValue: 'Student' })}
              </h3>
              <p className="text-footer-links text-center text-descript transition-colors duration-300">
                {t('student_description', {
                  defaultValue:
                    'Showcase research, get mentorship, access feedback.',
                })}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 transition-colors duration-300">
              <div className="rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-10 h-10 text-accent"
                  fill="currentColor"
                  viewBox="0 0 640 640"
                >
                  <path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 184.2 24 224C24 184.2 56.2 152 96 152zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 184.2 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z" />
                </svg>
              </div>
              <h3 className="text-subheadings font-bold mb-3 text-foreground text-center transition-colors duration-300">
                {t('advisers', { defaultValue: 'Advisers' })}
              </h3>
              <p className="text-footer-links text-center text-descript transition-colors duration-300">
                {t('advisers_description', {
                  defaultValue:
                    'Guide students, review work, provide expertise.',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mentors */}
      <section className="py-15 px-6 bg-background relative z-10">
        <div className="text-center mb-[100px]">
          <h2 className="text-section-headings font-bold text-foreground">
            {t('our_mentors', { defaultValue: 'Our Mentors' })}
          </h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-25 flex-wrap">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="relative z-20">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-secondary rounded-tl-lg z-20"></div>
                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-accent rounded-br-lg z-20"></div>
                <div className="relative bg-card rounded-lg shadow-lg p-5 max-w-lg z-20 transition-colors duration-300">
                  <div className="flex items-start space-x-8">
                    <Image
                      src={mentor.image}
                      alt={t(mentor.nameKey, { defaultValue: mentor.nameKey })}
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-lg object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    <div>
                      <h3 className="text-subheadings font-bold text-foreground mb-2 transition-colors duration-300">
                        {t(mentor.nameKey, { defaultValue: mentor.nameKey })}
                      </h3>
                      <p className="text-accent text-small-text font-medium mb-4 text-center">
                        {t(mentor.roleKey, { defaultValue: mentor.roleKey })}
                      </p>
                      <div className="flex space-x-4 justify-center">
                        {mentor.socialLinks.map((social, socialIndex) => (
                          <SocialIcon
                            key={socialIndex}
                            icon={social.icon}
                            url={social.url}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Members */}
      <section className="py-20 px-6 bg-background mb-25 relative z-10">
        <div className="text-center mb-[150px]">
          <h2 className="text-section-headings font-bold text-foreground">
            {t('our_team_members', { defaultValue: 'Our Team Members' })}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-20">
            {teamMembers.map((member) => (
              <div key={member.id} className="relative">
                {' '}
                <div className="relative mt-16 bg-card rounded-lg shadow-lg p-6 max-w-sm z-20 transition-colors duration-300">
                  <div className="flex flex-col items-center">
                    <Image
                      src={member.image}
                      alt={t(member.nameKey, { defaultValue: member.nameKey })}
                      width={120}
                      height={120}
                      className="w-42 h-42 rounded-lg object-cover -mt-20 mb-4 hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    <h3 className="text-subheadings font-bold text-foreground mb-2 transition-colors duration-300">
                      {t(member.nameKey, { defaultValue: member.nameKey })}
                    </h3>
                    <p className="text-accent text-small-text font-medium mb-4 text-center">
                      {t(member.roleKey, { defaultValue: member.roleKey })}
                    </p>
                    <div className="flex space-x-4 justify-center">
                      {member.socialLinks.map((social, socialIndex) => (
                        <SocialIcon
                          key={socialIndex}
                          icon={social.icon}
                          url={social.url}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-14 -left-2 w-12 h-12 bg-secondary rounded-tl-lg -z-20"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-br-lg -z-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
