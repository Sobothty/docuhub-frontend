import React from 'react';
import Image from 'next/image';

const DiscussionForumSection: React.FC = () => {
  return (
    <section className="bg-gray-100 py-12 w-300 justify-around justify-betwee items-center px-6 md:px-20 flex flex-col md:flex-row gap-12 mx-auto">
      {/* Left side: Image container with blue blob */}
      <div className="relative w-64 h-[460px] flex-shrink-0">
        {/* Blue blob background with blur */}
        <div
          className="absolute -top-12 -left-12 w-74 h-[460px] bg-blue-600 rounded-[80%_44%_44%_70%/_100%_100%_100%_100%] filter drop-shadow-lg"
          style={{ filter: 'blur(8px)' }}
        ></div>
        <div className="absolute -top-12 -left-12 w-72 h-[460px] bg-blue-600 rounded-[80%_44%_44%_70%/_100%_100%_100%_100%] filter drop-shadow-lg backdrop-blur-md"></div>
        {/* Person image */}
        <Image
          src="/hero-section/DiscussionForumSection.png"
          alt="Person holding laptop"
          className="relative h-full -top-4 left-4 scale-135 object-contain"
          width={256} // Adjust based on actual image width
          height={460} // Match container height
        />
      </div>

      {/* Right side: Text and stats */}
      <div className="max-w-xl flex flex-col gap-6">
        {/* Label */}
        <p className="text-sm text-blue-600 font-semibold uppercase tracking-widest">
          DOCUHUB DISCUSSION FORUM
        </p>

        {/* Main heading */}
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Connect, Share, and Learn Together
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-md leading-relaxed">
          Join DocuHub’s Discussion Forum—a vibrant space for exchanging ideas,
          sharing research insights, and supporting fellow learners. Collaborate
          with a global academic community and expand your knowledge through
          meaningful conversations and mentorship.
        </p>

        {/* Stats container */}
        <div className="flex gap-6 mt-4">
          {/* Stat Item */}
          <div className="bg-white rounded-xl px-6 py-8 flex flex-col items-center shadow-md w-24">
            <span className="text-blue-600 font-bold text-3xl">12k</span>
            <span className="font-semibold text-gray-800 mt-2">Members</span>
          </div>

          <div className="bg-white rounded-xl px-6 py-8 flex flex-col items-center shadow-md w-28">
            <span className="text-blue-600 font-bold text-3xl">98+</span>
            <span className="font-semibold text-gray-800 mt-2">
              Discussions
            </span>
          </div>

          <div className="bg-white rounded-xl px-6 py-8 flex flex-col items-center shadow-md w-28">
            <span className="text-blue-600 font-bold text-3xl">10+</span>
            <span className="font-semibold text-gray-800 mt-2">Advisers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscussionForumSection;
