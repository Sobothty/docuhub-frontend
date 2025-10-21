"use client"

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';    

const HeroSection: FC = () => {
  const { t } = useTranslation('common');
  const [key, setKey] = useState(0); // Add key for forcing re-render

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  // Split text preserving grapheme clusters
  const splitText = (text: string) => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), s => s.segment);
  }
  
  // Fallback to basic split
  return Array.from(text);
};

  // Force re-render when language changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [t]);

  const headingText = t('Discover, Share & Collaborate   on Academic    Excellence');

  return (
    <section className="h-[710px] md:min-w-md lg:min-w-xl bg-card px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-6 grid grid-cols-1 md:grid-cols-2 items-center justify-between md:gap-4 lg:gap-8">

      {/* Left Content */}
      <div className="mt-6 md:mt-6 max-w-xl md:max-w-md lg:max-w-lg ml-0 sm:ml-4 md:ml-8 lg:ml-20 text-center lg:text-left gap-10">  
        <h1 className="font-bold sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-6xl tracking-tight leading-normal overflow-hidden">
          <AnimatePresence mode='wait'>
            <motion.div
              key={key}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap"
            >
              {splitText(headingText).map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0, 
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1], // custom cubic-bezier for smooth motion
                    repeat: 1,
                    delay: index * 0.05
                    , // faster stagger for smoother flow
                  }}
                  style={{
                    display: "inline-block",
                    whiteSpace: "pre",
                    minWidth: char === " " ? "0.4em" : "auto",
                  }}
                >
                  {char}
              </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
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
      <div className="relative mt-6 sm:mt-8 md:mt-12 lg:mt-0 flex-shrink-0 w-60 sm:w-72 md:w-80 lg:w-fit h-60 sm:h-72 md:h-80 lg:h-[480px] flex justify-center items-center mx-auto">
        {/* Blue circle background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-500 to-blue-900 opacity-90 " />

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
        <div className="absolute top-1/2 sm:top-2/3 md:top-70 -left-16 sm:-left-20 md:-left-40 bg-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 flex items-center space-x-2 sm:space-x-3 max-w-xs sm:max-w-sm md:max-w-xs shadow-lg z-20 animate-bounce">
          <div className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhIWFRMXFxUYFxcXFRgYGRcXFxUXFxUVGxgaHSggGBolHRUVITEhJSktLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMABBwMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABgIDBAUHAf/EAEIQAAEDAgIFCQUHAwMEAwAAAAEAAgMEEQUhBhIxQVEHEyIyYXGBkaFCUmKSsSNygqLB0fAUM7IkwuEVQ5PxNGPS/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECAwQFBv/EADQRAAICAQMCAwcCBwADAQAAAAABAgMRBCExBRIyQVETImFxgZHwodEUIzNCscHhUmLxFf/aAAwDAQACEQMRAD8A7igCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCA1GNaTUdIP8AU1McZ90uu89zBdzvAICF1XLZh7X6rY6iRlj02saBfcA17g7zAQG1wflVwuosDUcy73Z2mMD8fU/MgJjTVLJGh0b2vadjmuDgfEIC6gCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgPCUBGMc5QcOpLiWqYXj2I7yvvwIZfV8bICAY1y57RSUh32fO63cebYTf5ggIBjfKFiVVcSVT2MPsRfZN7rt6RHe4oCMWJJO0nMnieJKFW0VNiTBVzLjWBCvc2ZNFWyQu1oZXxO4xvcw+bSEwCXYTyqYnBYGZs7eEzAfzN1XeJJQt3MmmE8t8ZsKmke0+9E5rx36rtUjzKE95M8J5RMNqLBlWxrj7Mt4jfgNcAHwJQt3Ik0UjXC7SHA7CDcHxCElaAIAgCAIAgCAIAgCAIAgCAIAgLc87WNLnuDWja5xAA7ydiAheN8q2G09wJjO8ezANcfOSGfmQEAxrluqX3FLTxwjc6QmV/kNVrT8yAgGNaT1tXf+pqpZAfYLtVn/jbZnohBqWxHcMvJTghyRcEPFCrn6FQjCFW2VWQgIBZANVCTwhCDwoDxCTJoMRmgN4JpIj/APXI5nnqkXUDJLsL5V8ThsHStmbwljBNuGszVPndCe5kuwzlyGypo3D4oZA78j9W3zIWUyYYXyn4ZNl/Uc07hM0x2/Eej6oT3Il1PO2RoexzXscLtc0gtI4gjIhCxcQBAEAQBAEAQBAQflewZ09EJWAudTSNm1Wi7nMALJQO0McXDf0FDIZiYNpbSy6rBUxGWwu0SNve2ds881kkzRPJI2SA70JKlAPCFIKHRg7QoGTUYpovTzjpxtPgmMcB78kMxbkvGZgkI+F3SH7qyskuTN0xfGxDcU0SqoOtEXDizP02q6siZumSNE5hBsRnwOR8itE8mT25KbWQGTh+Hyzm0MTpO0DojvceiPNVc0uS0YSlwSrDdAXGxqJQ0e5FmfF7svILKV3obxo9SW4XgNPT/ANqJrT756Tz+I5rKUm+TaMIrg2gYqlisBSQCpSIyWHWWiKluR4aC5xDWja5xDQO8lSQRXF9PKWK7Yrzv+Hosv98jP8IKuot8FHNIjNXjOIVmWtzER9ll2Zdp67vMDsXfT02ye8tvmc09SvIpoNG425u6Z7dnkvWp0NVfll/E5ZWyZJ8Fq5KV4kgOq4ZdhHuuG8Le2iFke2SKwm4vKOvaMaTxVjbdSYDpRk/mb7zfpvXz+p0k6H6r1PQrtU/mb5cpqEAQBAEAQBAEBZqalkY1pHtY3i4gD1UNpbstGLk8RWTR1Wm1EzLnS88GMcfW1vVZO+C8zpjobn5Y+ZzHTqPDa57pW000c7tsjXtZrWFgXsOs13fYHLas3qV5I3j02X90kRXD8WxCisIagSxjayQE6ueyxN9nuu8F1Qrc6/aeXBw3r2VjgTfBOVCJ1m1LDE/eRdzfK2s3y8VRwaMVanyTahxOKZofFI17Tva4Eeig0zky2yKcAuAquCSoKrJKXxA7QCoJNLi2idNUDpxtvxtn5qMY4Dw+SJHQilhlN2c6Rawebtbvtq7D4o5y4yRGqC3wbiOKwAAAA2ACwHgqGhdaxAV6qAqDUIyekqUQazFsWgpxrTStj4Am7j3NGZ8ArpPyKtpckJxPlBLiWUcJcffkF/EMB/yPgumrTzseIrJjO6MTRy0FVVkOqpnHeG3GXc0dFvgF6tPS/Ob+hyT1LfBtKHBI49jc+JzPmvUq09dfhRzyk5cmxbDZbFSrVQg8uOKq5xXLLJNl2B72uD2a4c03Dmggg8brns1Onw1KSLxrszlJnYtFqypki/1UJjeLWddv2gI62q0nVPHv8B4GojUp/wAp5R31uTXvLc3SwNAgCAIAgCAIDm/K69wko7GwvN25nmx6bVx6t4x+eh6fTv7/AM9TQVWCva4tJAG48Uq0zsljOC9vUo1xTabMKpwiwzcT3ZLuj0+K5Z51nWZvwxS/X9iMYnQPabtByK7qKIxTgvM863VzskpSJH/0OKaBj3sBBGTtjgeFxnx8l1aXEk6bVnBW1cTj5mnfo5NC7nKWdzXdpLT3aw2+IKm3psJbwePmZxulEz6XTyupbNqohI33j0Tb7zQWk+AXmW6OyvlbHVDUJk2wTTmkqLASajz7EnRPgdh8CVytG8ZxfBKY5gc1Q0LocowSVAqAR/EW/aO7/wBAsnyXRjaqEnoCEC6kEdxrTSkp7gyc48exFZ1u93Vb4m6uoNmcrEiKV2k+IVWVPHzEZ3jrEffcP8R4rWNcfNlHKcuEYFLok9515i6Rx23dt73XLnLuqlpYbyzJ/ZGMqrZeiJBSYA5osxjWjsXYuqVxWIQ/0U/g2+ZGwjwOQ7SB3D91nLq0/KKLLRx82ZLMAO95+n0WEupXv0+xdaWtGSzAGb7nvJ/VZS1l8v7mWVNa8jIiwWMeyPJYu2yXLf3LqMVwjKjw5g9kKnJJeFK0bgmBk6FCQWgtIIIFiMwRbIg7wrFStAEAQBAEAQBAQblbpA6ljlvYxyttle+v0beeqfBcmsjmvPoej0yeLXH1RddG2VgvvAI7O1WhLZNHPOHMWaKqpiw2dmNx4/8AK9Oi/u2fJ5V9DhuuDDnomuGYXWn6HKy/gEQLJKV23rMPbv8A0PmtdQ2u2+PyZvQ+5ODNbM4MJDyGkbbkBehCSksowaw8Mx5KyG2bgfzKXJR5ZGMmhxDC6R9ywPYfgbYeLXZLhujpZctL5GkVZ5GLh9bXUh+wlc6MbGusR3ahJ1fwkLyLqq0/dlk6oSsSJVg/KiAdSrhLD7zLkd5YekPC65nB+Rsrl5k7wnSCnqBeGVr+wHMd42jxVGsGyafB5Xt6ZPG30ss2ty6Zrq+ojhbryvbG33nuA8BfaUSDaRC8V5RIWnUpo3TO3OddrfAdZ3kB2rRV+plK1eRGqyora3/5E3Nxn/ttybbhqg5/iJV0kivvS5M3DcHgisQ0Fw9p2Z8Nw8E3LxjFEho2Anco7WX7jfUoCsokdxeNRGNr2jvcB9StI0ylwijmlyW3YpCPbB7rn6Bbx0Vz/tZR3wXmWpMfhHE+Fv8AIhbR6bc+Vj6mb1MDGfpRH7Lb97gPoCrPQKPjnFfn0I9u34YtmO/Sk+yweOsf1Co69JDxWr6fjLJ3viBbOPTu6th4D9bqj1HT4+cn+fQt7LUv0RJqPROsnja91WGB7Q6zQ4mzhexA1RvWq1WmSzGv7/jMnVbw5Er0XwR1HFzRmMrb9G7dUMHutFzYb7XXNqLlbPuxg0rh2LGTcrA0CAIAgCAIAgNNpFitGyN8dVNG1rmkFpcNa3ENF3X8FnZKGMSZ16bT6iclKmLfx8vvwc60Wxdpe+KJ/OQtcbEjVIG52qc9U8FzaeEpScY7o9HqUI1QUrV2yflzn7Eulia9uq7MfzMLo3TPJeJI0dVSGN1jmNxXfRf3bM82+jt3XBhVYMbmTN2tIv8A8/TxXp0tSTrfDOVNxeUZePYdFKGTNAGtckgZnIbe0bF5NntIS7G3seklGS7sGl/6YwKmGWwiptAz3Qp7WQeT0YtsTtYIxi9I3Y4C3bZT2FWRedzY3azH6rhsLXZjuIzCh1y9CmF5M2kGntZHGWNqCd13NaXjucR9bqnsH6F++a2yR2prnSv5yZ75H8XOue65NwOwZLRUMZzzuXYcSDcmtA8VZULzY78cIvtxSQ7P8SrqmvzZV2sy4J53bNbyAWihSuTN2y8ja0rJz7RH4z/tCn+J0tfkiyq1E+E/8GeKWU+0PxNJ+rllLrEI/wBOC+3/AMN46Cb8b/UuijeNrz4ANXNPrWofGEdEen1Lnc9/p+895K5ZdR1MuZv/AAbx0lK4iinmOweSwlfZLxSb+rNFXGPCQEJ7VmWLrIbIVLxkAaSTkN+4d99iJZexV7ckYh0nq6OZ5pql7GOe54aDrMOs4u6jrgHPgun34HVXGm+HrjYmeC8tFQ2wqaeOUb3Rkxu77G7XH5VpG5f3GNnTXzW8/B/uTvB+U/Dp7B0pgcd0w1R84uz1W8V3bx3POshKp4sTXz/MEvp52SND2Oa9p2OaQ4HuIyKgqXEAQBAEBzflkxOaIUkUT3NE0j2u1XFpNtQNzG0dI5LnvzhJM9PpsowcrJRTxjk5XiNA+J1ntIvv4+O8riccH1+m1dd8cxf09CzRVT4niSM2cPXiDxCtXOVcu6JOq0teqrddi2/wdR0Y0hbOzg4dZu9p7OLV6qlHUR7o8nwOq01ugt9nPw+TJI6MPbquFwf5dYbph4kjS19EWgsdm07D/N69HTajOz5PN1FPbuuCOy4s+MCDVLi0k5Me617bNXdlfxXpzppuffJ4ZjG+Vawiwayod1YpP/G1v+ZT2Glj5v8APoHqrGeGKsd7JH3pQP8AAFSlpo8R/PuUd9j8y2/Cahw6T2Dvc9/1IU+3rXEF+fQq5TfmYNToq47XjwYB9SUlqW+Eiu5oq3Rst2uJ8v2XJZY/U1jNmokwY7gSuOdqXLOqtWS4Rcg0bkPsgd65JaqteZ2R0l0uVg2tNovbrO8ljLW+iNo6D/ykbSmwSNu6/qsJauxm0dHTHyz8zPio2jY0X8/pcrGVkpcs3jCMeFgy44OzwtY+p/RUJMhlOT/M/LL6IA6ADaQPH9BYjyQFJpxa9iRxtYfNlbxVlvwQ36mHPPG3a5vgS8+bBbzW0dPZLyMZaiteZqanHYW7Dc94Ho3WWv8ADJeKSRCtnP8ApwbNXUaSE9Rvk23q6/0CnFEfVm0dHq7OcRNZU4nK/b4XJdbtF8h5Kf4hR8KSN49Hz/Uk2Yuo5xu4kntWM7XLk9GnQRrWIo3GG6LVE1i2Mtb7zuiPXM+AVN2J20VeKX23KMbww0sohykeWBxsD7RcNW2/Z6ru0unT/mSeMHja/q2U6oQWGvPf9Ce8k2i32rZpKzmntOt/Sxyar3gbHSC+bDY5WN7bRsXXZapLC+54lVTTy/sdrXOdIQBAEBzvlhoJHspZ2ML2wSl8lhfVZ0SXd3RWF/GT0+mpTlKvKTktsmsikgrI7izhvB2tPaNywTUkaW0X6WeeH6kXxzRKSO74rvZw9ofv9VSVeN0exousRl7l2z9fL/hoKKqfC8SMNnDb28WkKtdkq5dyPT1ekq1dXZPjyf8As6hozpCydlxkR1mna0/q1esnHUR7o8nwGp09ugt9nZx5Mk5Y17bHMFc+6Y2aNFXUZjOfVOw/ou+jUZ2keffp+3dcGI6Vrc3OA7zZdLmlycyi2Ys2KxjYS4/CCfXYsJ6yqHLOiGjtnwjAlxd56sdu1x/QX+q5J9TivCjsh0qb8TwYctZK7a8DuH73XJPqNj42OuHTKY+Jtlh0F83XP3jb65LmlqLJcs64aaqPhj/s9bDYZAW7AT+wWW7Nirmz/Nnp+6nBVsuNhO/1/c3+qnBXJdbGN5ufM+Ru0psRlmRqao6Q1R8RDR8rsvJSot8Iq5xXLLcmIRMGcjbfC0uHm+zfIreOlsflgweqrXG5ranSunGQu/vcXejch8yt7CteOX2NILU2f0639TV1OmDz/bZq+DW+ou78ynuojws/M6odK1dnjkkaiqxieQ3Lh5ax83XKh6trwpI66+hVf3ybMKUud1nOd3k/RZSvnLlnoV9N09fhiikRDcFnlnUqoozqDBppv7cbnduweZyUpNmVt9NXjkSnDdASbGZ4Hwsz/Mf2V1W/M8u7q6W1UfqyU0GA08GbI2gj2jm7zOxaKCR5durut8UjFxTSmmguNbXd7rczfhwHijaRNWktt4RDZMUnq5yKSm1qmTLLpOawCwPBgy2mwuuqj3172yOfXab2DWJJyfl5o6HoPyV8zIyrrpTJUtcHtYxx1WOGYJdkXEcBZu7MLodiS7YrY8+MHnMmdQWRqEAQBAcU0h5VamYObSsbBHdw1yA+Q2Jado1W7DuPeu6nT1y5efgcN2pnF4Swc+oa+Wndrsce8bR2cCOwrn1PTc+9Vz6HtaDr7x7HVruj6+a/PudI0Z01imAZNZrjlreyT236p7D5ry+5xfbNYZ6t/Tozh7bTPuj+ps8b0TiqBrs6EnvDf94b1Mq1Lc59J1G3TPt5j6ft6EDnpKihmDrapGw+w8e7/wAFZwlKqWUe9P8Ahup0uD/6mdF0ax5szA5u7JzTtYeHcvVXbfHujyfD6jT26G11WceT+HqSYsbI0gi4K52sF9mc/rqJrHua1oyJsS6588yvPstlJ8ndVXGK4MQwm9vQD9/2WR0IqZSXytc+JPll9FJOUi82ktls7Nnm0WPoUHd6FbKQHqgn7o/XJw8ii+BDfqeSwavW1WH4nZ+lneivGE5cIylbCPLNZW4rBH1pc/hAb+Y2J8lstNPz2Mf4mL2imzTVGlkY/tx3PE3df/EfVXVVUfFLJrGrVWeGGPma2o0qndk3ojgDq+jAPqp9pVHwx+5vHpV8/HPHyNc+uldteRf3Rb12+qh6mflsdlXRqF4sv5lgsvmbk8SSfqsZWSfLPSq0lVfhikVhqzydaie2Qtgv01G+R2qxhceABP8A6TBSyyFazN4JLhug8z7GQiMcOs7yGQ81dVs8y7rFUdoLP6IleG6I00ViWa7uL8/y7PRaKCR5F3Ur7ds4XwM+uxOnpx9pI1vAXz8Ar7I5YVWWP3Vki2I6eXu2niLvidkO+23zsq9/od8endq7rpKKIVjGk80p1XSOeSbakeTbnK2W3uzWkaZz52Ky1mk0+1ce5+rJhobyU1dVqy1hNLAbHmwLTPHAg/2/xZ/CNq6Y1Vw4WWcN3UNRds3hei2/6dqwDAKaij5qmibG3fbNzj7znHNx7SVZtvk4zZqAEAQBAEBwHSDAKigMnOUpdAZ5iyQEFvNueXMvq31T0j1rbF0QqVjzGWGc1lrgsSjlGjbTQy/236jvcdv7uK29tdTtYsr1MPZVW71vD9DXVmGyRm9i08RmD3q1kKNWsef6m+k1mq6fPujx5+jJDovplLARG+7me6TmB8Dv9p9F41+nt0z33XqfWUX6Tqsfd92z09f3/wAnSIKqnrYjbVeDkQRmOxwOxZ5UkcFtF2ks32fk/wBiMVejk1LJz9L0gOtGT1m72g/vs9EhKVUu6J1y1VOtq9jqtn5SXk/zkkuBY017dZt7Xs5hFnMdvBC9P3b490eT5y2qzR2ezs48muGvVfApqKAuc4tYSCSb7GkeILT5heLOuUZNYPTrsi4p5MGSna3J0kY7B0vyjWA9FMaLJcIl6iuPLNdWY7SRZOlLj7twB8vSPotP4VrxvBEbZzf8uLf0NRU6cRjKGC/e29vF5/2qe2iPnk6oaDXW+Xb8zT12l1VLlcNHC5PoLD0T28V4YnbDoMn/AFJ/Y0s9RI/rSOtwBsPIKstRY/M7a+jaav8Atz8zG5kcFk5N8nZHTQh4Uke82oyW9kNRMk9h6GoSolTWXQl4SyzdYfoxUS56mo3i/L02+isoNnBd1PT1cPL+BKcM0LiZYyuMh4dVvkMz5rRVnkX9XtntDZfqSJghgblqRsHc0BXxg81ynY8vLZpMS05p47iO8p+HJvzH9FDkkddXTrZ7vZfEiVfphUznVY7UB3Ri5+b9lpGqySzjC9WXlPQ6fZvvl6Lf/n3ZpapzYzrSuu856t9Z57yrx06b9TGzq9mMVpRX3f7fnJtdG9EK/Fbc2zmKXfI64aR2b5D3ZcSF0qqMOTzJ3TteW8/M7ZoXyd0eGgOYznJ7ZzSAF3bqDZGO7PiSjlkqkS9VJCAIAgCAIAgPCL5HYgIZpHya0dVdzG/08h9qMDVJ+KPZ5WK6K9TOG3KOezTQnvwznmM6I4jQ3Or/AFEA3tBfYdres31C07aLf/VmWbqv/ZEcIppsj9k/t6t+/d6KWrqlh+9EiLqnLui+2X2L1O2opXh7HHLY9ueXBw3jw/deZbp4S96rZ+j/ANM+o0fWG4+x1q7o/wDkv9r/AGid6PaYxy2jntHIbAH2H9x9k9h8CVzKflLZm+q6XiPtaH3R52/NzeT4Y0u5xnRfbMjeOB4raEnB90Tx7Pfh2T4/x8iC6UT1zCR0WxjYQNb65NPgps1cs5wju6d0vTXbSm/lx/sh1VNK/wDuSvd2FxA+UWC5pX2S5Z9JT0jS1cR+5YbEBsFljk741xjtFYKrIWBQFJQg8shGBZCDKo8Mll6jCRx2N8zl5Kyg2cd+uop8Ut/QkNBohvmf+Fn/AOj+y1VXqeNf1tvaqOPiyRUNBDD1GAHjtJ8TmtVBI8m3U23P322Wq/SWCHJzwXe63pH02eKNpE1aW2zhEVxTlAecomhvaek7yGQ9VMYzn4UdLo09G90/oiM1VfPObvJPa838mjILqhoJPexnNZ1qur3dPD6syYsJs3Xnfqt+L9GrVKqvatZfqedbqNRqN7zPHoZmF09RVv5jD4HE732zA95zjkwdp8FZ1t+9YzFSS92tHVdDuSGCAiatIqJtupnzTT23zkPfl2b1V2eUdjRQ85HTWNAAAAAGQAyAA2BZGh6gCAIAgCAIAgCAIAgCAjWkWg1HWXc+LUkP/cj6LvHc7xBWtd84cMxsohPlHN8Y5Pa+ju6ld/URe6B0gO2M7fwm/Yt3Km3xrDMOy6rwvKIlLiMZJbNGYnjI5GwO8EbR4rlv0Laytz0+n9Xnp5bbeqfH/Df4BpZJT2a489BusbuaPhJOY7D4ELzmp1vDPpOzS9Rj3V+7P0/P8r6k/oquCrZrNLXtOR7Owg7D2FXTjI8a6i3TzxJYZF9ItBwbvg+X9juWUqvQ9XR9ZlH3bt16nP6yifG4tc0gjbcWsssH0ddsLI90XlGOoLniEFUMDnnVY0uPAC//AKUqLZjbfXUszkkbmj0YldnIQwcOs70yHmto0t8nj6jrlcdqlk3lHgcEWerrHi/P02DyW0akjxb+pai7mWF6LYyqnEo4hdzmtHabeQVsJcnLCudj91EexHTVjf7Yv2u6I8tp9FXuztFHZHQqC7rpJIjNdpDUT5axtwHRb6ZnxW8NHbPnYznr9JR/Tj3P1ZgtpXO6zsuAyC76tBCO73PL1PWL7ds4XwNjRYVcXsGtG1xyC1nbXXst2cUYWWbsvNrGhwjpmGWQmwdYm54NaM3HuXO1O3eTwjVdle0d2T7RTklmnInxF7mN2iIEa57CdkY7Bc9xUOyMNofcuq5T3l9jsGE4VDTRiKnibGwbmjaeJO1x7TmsG23lm6SWyMxQSEAQBAEAQBAEAQBAEAQBAEAQGmx/RekrRaoha51rB46Lx3PGduw5K8LJQ4ZSdcZ8o5RpLyO1ERMlBNzg26jiGSd1+o/x1e5aSnCxYmilaspfdW/3IXRYtUUU+pMH08zdpLS0EfGw+z27O5cNukcfer3PpdJ1mu+PsdYvr+cfNHUtHNMY5rMltHIbWN+g/wC6dx7D4ErCNmdmTq+lSgvaUvuj+q/PU2+L4JDUCz22ducMiFaUFI8+jU20SzBnPcU0ImY+zS0tJ6xyFu0ce5Y+zaZ9BDrdbhmS39DLotDomZyuMh4dVvkMz4lXjWvM87UdYuntDZfqZszo4W2aGsaNwAAW0Y4PInOdjy92R6v0qiZex1z8Oz5tilzSOivQ2S3ey+JGq3SyV+TOiPhzPzH9Arwqts4WC0paPT+J9zNSRLIbuce+9z5ldtfTlzN5OK7rUsYqSii7FQAZnM9q9CvTxhwjxrdVOx5k8mdTUhcbMbf6BTZbCtbmcITsexellhhyP2svujqjv/nguGVtlrxHZHXGqFe8t2b7RvQauxQtkf8AY0xsQ5wIaR8DNsnfkO3cq+5X8Wae/Z8Edo0U0MpMPb9jHeS1jK+xeeIB9kdgsFjOyUuTaFcY8EiVC4QBAEAQBAEAQBAEAQBAEAQBAEAQBAEBr8ZwSnq2c3Uwslbu1hmO1rtrT2gqU2uCGkzmON8kT4ruw+XWZmf6ec+jJQMu5w7ys7a42c8+p36LqF2kfuvMfR/69DWYbpBVULhDVxSBoy1Xiz2j4HX1ZW9xI4HcuN99bw+D3XTpeox76n2z81+/7o3mN6ZUoYxzZNckE6rQdYdhHsnLepdkWeb/APl6nuacf2ILi2nEjr82wMHE9I+QyHqrRcpvEUXlo6aF3XzS+BEqutnmN3En7x+jRkF3V6CcvGzz7er1VbUR+rLbKC+bjf8AnBejVooQ8jxtR1K23xMzI6YBdca0jglY2X4oi4hrQSTuAScowWZMiMZTeEZM0McOc7s90bTclcFmrlPas7q9Ko7zL+D4bW4k7mqWIsjG0jotb9+TYO4ZngVj7OMd7Ga97ltBHXNDeSulpLST2qJhY5j7Np+Fh6x7XeACpO5vZbI0hSlu92dBWJsEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAf/Z"
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
        <div className="absolute top-4 sm:top-12 md:top-12 -right-12 sm:-right-16 md:-right-16 bg-blue-500 rounded-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 flex items-center space-x-2 sm:space-x-3 max-w-xs sm:max-w-sm md:max-w-xs shadow-lg z-20 animate-bounce">
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
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487.5-.67.51-.173.007-.371.009-.57.009-.198 0-.52-.074-.792.373s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.711.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347z" />
          <path d="M20.52 3.48A11.883 11.883 0 0 0 12 0C5.377 0 0 5.377 0 12c0 2.115.552 4.099 1.518 5.865L0 24l6.327-1.63a11.893 11.893 0 0 0 5.66 1.424c6.623 0 12-5.377 12-12 0-3.2-1.247-6.202-3.48-8.52zM12 21.6a9.59 9.59 0 0 1-4.859-1.429l-.348-.207-3.75.966.995-3.651-.226-.374A9.604 9.604 0 0 1 2.4 12c0-5.313 4.287-9.6 9.6-9.6 2.566 0 4.978 1 6.785 2.814a9.54 9.54 0 0 1 2.816 6.786c0 5.313-4.288 9.6-9.6 9.6z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
