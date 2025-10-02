'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const developmentServices = [
  {
    icon: '/subject-logo/fluter.png',
    title: 'Flutter Mobile Development',
    description: 'Cross-platform mobile apps',
  },
  {
    icon: '/subject-logo/ios.png',
    title: 'iOS ICS Development',
    description: 'Native iOS applications',
  },
  {
    icon: '/subject-logo/sql.png',
    title: 'SQL & Data Modeling with PostgreSQL',
    description: 'Database design and management',
  },
  {
    icon: '/subject-logo/web.png',
    title: 'Web Development',
    description: 'Modern web applications',
  },
  {
    icon: '/subject-logo/android.png',
    title: 'Android Development',
    description: 'Native Android applications',
  },
  {
    icon: '/subject-logo/java.png',
    title: 'Java Development',
    description: 'Enterprise Java applications',
  },
  {
    icon: '/subject-logo/spring.png',
    title: 'Spring Framework',
    description: 'Spring Boot applications',
  },
  {
    icon: '/subject-logo/next.png',
    title: 'Next.js Development',
    description: 'React framework applications',
  },
  // Duplicate services for seamless scroll
  {
    icon: '/subject-logo/fluter.png',
    title: 'Flutter Mobile Development',
    description: 'Cross-platform mobile apps',
  },
  {
    icon: '/subject-logo/ios.png',
    title: 'iOS ICS Development',
    description: 'Native iOS applications',
  },
  {
    icon: '/subject-logo/sql.png',
    title: 'SQL & Data Modeling with PostgreSQL',
    description: 'Database design and management',
  },
  {
    icon: '/subject-logo/web.png',
    title: 'Web Development',
    description: 'Modern web applications',
  },
  {
    icon: '/subject-logo/android.png',
    title: 'Android Development',
    description: 'Native Android applications',
  },
  {
    icon: '/subject-logo/java.png',
    title: 'Java Development',
    description: 'Enterprise Java applications',
  },
  {
    icon: '/subject-logo/spring.png',
    title: 'Spring Framework',
    description: 'Spring Boot applications',
  },
  {
    icon: '/subject-logo/next.png',
    title: 'Next.js Development',
    description: 'React framework applications',
  },
];

export default function DevelopmentServicesBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate services for seamless scroll
  useEffect(() => {
    if (!containerRef.current) return;
    const ul = containerRef.current.querySelector('ul');
    if (ul && ul.cloneNode) {
      const clone = ul.cloneNode(true);
      containerRef.current.appendChild(clone);
    }
  }, []);

  return (
    <section className="w-full bg-blue-600 py-8 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4">
        <div
          ref={containerRef}
          className="flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <ul className="flex items-center [&>li]:mx-8 animate-infinite-scroll">
            {developmentServices.map((service, index) => (
              <li key={index} className="flex-shrink-0">
                <div className="flex items-center space-x-4 text-white min-w-[280px]">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center p-2">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={38}
                      height={38}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
