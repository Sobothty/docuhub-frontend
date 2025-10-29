import React from "react";
import Image from "next/image";

const DiscussionForumSection: React.FC = () => {
  return (
    <section className="discussion-forum-section flex flex-col md:flex-row justify-center md:justify-around items-center gap-8 md:gap-12 lg:gap-30 py-16 md:py-20 lg:py-24 px-6 sm:px-10 md:px-12 lg:px-20 mx-auto max-w-7xl">
      {/* Left side: Image container with blue blob */}
      <div className="relative w-48 h-[340px] hidden md:block sm:w-56 sm:h-[400px] md:w-60 md:h-[480px] lg:w-64 lg:h-[460px] flex-shrink-0">
        {/* Blue blob background with blur */}
        <div className="discussion-forum-image-blob absolute mt-4 -top-8 -left-8 sm:-top-10 sm:-left-10 md:-top-12 md:-left-12 w-56 h-[340px] sm:w-64 sm:h-[400px] md:w-68 md:h-[440px] lg:w-72 lg:h-[460px] rounded-[80%_44%_44%_70%/_100%_100%_100%_100%]"></div>
        {/* Person image */}
        <Image
          src="/hero-section/DiscussionForumSection.png"
          alt="Person holding laptop"
          className="relative h-full -top-3 left-3 sm:-top-4 sm:left-4 object-contain"
          style={{ transform: "scale(1.35)" }}
          width={1200}
          height={1200}
          priority
        />
      </div>

      {/* Right side: Text and stats */}
      <div className="w-full md:max-w-md lg:max-w-xl flex flex-col gap-5 sm:gap-6 md:gap-7 text-center md:text-left">
        {/* Label */}
        <p className="discussion-forum-label text-sm sm:text-base">
          DOCUHUB DISCUSSION FORUM
        </p>

        {/* Main heading */}
        <h2 className="discussion-forum-title text-3xl sm:text-4xl md:text-4xl lg:text-5xl">
          Connect, Share, and Learn Together
        </h2>

        {/* Description */}
        <p className="discussion-forum-description text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 lg:line-clamp-none">
          Join DocuHub Discussion Forum—a vibrant space for exchanging ideas,
          sharing research insights, and supporting fellow learners. Collaborate
          with a global academic community and expand your knowledge through
          meaningful conversations and mentorship.
        </p>

        {/* Stats container */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-5 md:gap-6 mt-4">
          {/* Stat Item - Members */}
          <div className="discussion-forum-stat-card flex flex-col items-center min-w-[100px] sm:min-w-[110px] md:min-w-[120px] flex-1 max-w-[130px] sm:max-w-[140px]">
            <span className="discussion-forum-stat-number text-3xl sm:text-4xl">
              12k
            </span>
            <span className="discussion-forum-stat-label text-center">
              Members
            </span>
          </div>

          {/* Stat Item - Discussions */}
          <div className="discussion-forum-stat-card flex flex-col items-center min-w-[100px] sm:min-w-[110px] md:min-w-[120px] flex-1 max-w-[130px] sm:max-w-[140px]">
            <span className="discussion-forum-stat-number text-3xl sm:text-4xl">
              98+
            </span>
            <span className="discussion-forum-stat-label text-center">
              Discussions
            </span>
          </div>

          {/* Stat Item - Advisers */}
          <div className="discussion-forum-stat-card flex flex-col items-center min-w-[100px] sm:min-w-[110px] md:min-w-[120px] flex-1 max-w-[130px] sm:max-w-[140px]">
            <span className="discussion-forum-stat-number text-3xl sm:text-4xl">
              10+
            </span>
            <span className="discussion-forum-stat-label text-center">
              Advisers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscussionForumSection;
