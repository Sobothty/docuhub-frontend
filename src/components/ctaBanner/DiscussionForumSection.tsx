import React from 'react';
import Image from 'next/image';

const DiscussionForumSection: React.FC = () => {
  return (
    <section className="bg-background flex flex-col md:flex-row justify-center md:justify-around items-center gap-8 md:gap-12 lg:gap-30 py-10 md:py-4 lg:py-6 px-6 sm:px-10 md:px-12 lg:px-20 mx-auto max-w-7xl">
      {/* Left side: Image container with blue blob */}
      <div className="relative w-48 h-[340px] sm:w-56 sm:h-[400px] md:w-60 md:h-[440px] lg:w-64 lg:h-[460px] flex-shrink-0">
        {/* Blue blob background with blur */}
        <div
          className="absolute mt-4 -top-8 -left-8 sm:-top-10 sm:-left-10 md:-top-12 md:-left-12 w-56 h-[340px] sm:w-64 sm:h-[400px] md:w-68 md:h-[440px] lg:w-72 lg:h-[460px] bg-blue-600 rounded-[80%_44%_44%_70%/_100%_100%_100%_100%]"
          style={{ filter: 'blur(8px) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))' }}
        ></div>
        {/* Person image */}
        <Image
          src="/hero-section/DiscussionForumSection.png"
          alt="Person holding laptop"
          className="relative h-full -top-3 left-3 sm:-top-4 sm:left-4 object-contain"
          style={{ transform: 'scale(1.35)' }}
          width={256}
          height={460}
          priority
        />
      </div>

      {/* Right side: Text and stats */}
      <div className="w-full md:max-w-md lg:max-w-xl flex flex-col gap-4 sm:gap-5 md:gap-6 text-center md:text-left">
        {/* Label */}
        <p className="text-xs sm:text-sm text-blue-600 font-semibold uppercase tracking-widest">
          DOCUHUB DISCUSSION FORUM
        </p>

        {/* Main heading */}
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
          Connect, Share, and Learn Together
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base md:text-md leading-relaxed line-clamp-2 lg:line-clamp-none">
          Join DocuHub Discussion Forum—a vibrant space for exchanging ideas,
          sharing research insights, and supporting fellow learners. Collaborate
          with a global academic community and expand your knowledge through
          meaningful conversations and mentorship.
        </p>

        {/* Stats container */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-5 md:gap-6 mt-2 sm:mt-3 md:mt-4">
          {/* Stat Item - Members */}
          <div className="bg-white rounded-xl px-4 py-6 sm:px-5 sm:py-7 md:px-6 md:py-8 flex flex-col items-center shadow-md min-w-[90px] sm:min-w-[100px] md:min-w-[110px] flex-1 max-w-[120px] sm:max-w-[130px]">
            <span className="text-blue-600 font-bold text-2xl sm:text-3xl">12k</span>
            <span className="font-semibold text-gray-800 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-center">
              Members
            </span>
          </div>

          {/* Stat Item - Discussions */}
          <div className="bg-white rounded-xl px-4 py-6 sm:px-5 sm:py-7 md:px-6 md:py-8 flex flex-col items-center shadow-md min-w-[90px] sm:min-w-[100px] md:min-w-[110px] flex-1 max-w-[120px] sm:max-w-[130px]">
            <span className="text-blue-600 font-bold text-2xl sm:text-3xl">98+</span>
            <span className="font-semibold text-gray-800 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-center">
              Discussions
            </span>
          </div>

          {/* Stat Item - Advisers */}
          <div className="bg-white rounded-xl px-4 py-6 sm:px-5 sm:py-7 md:px-6 md:py-8 flex flex-col items-center shadow-md min-w-[90px] sm:min-w-[100px] md:min-w-[110px] flex-1 max-w-[120px] sm:max-w-[130px]">
            <span className="text-blue-600 font-bold text-2xl sm:text-3xl">10+</span>
            <span className="font-semibold text-gray-800 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-center">
              Advisers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscussionForumSection;