'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    questionKey: 'faq_1_question',
    answerKey: 'faq_1_answer',
  },
  {
    questionKey: 'faq_2_question',
    answerKey: 'faq_2_answer',
  },
  {
    questionKey: 'faq_3_question',
    answerKey: 'faq_3_answer',
  },
  {
    questionKey: 'faq_4_question',
    answerKey: 'faq_4_answer',
  },
  {
    questionKey: 'faq_5_question',
    answerKey: 'faq_5_answer',
  },
  {
    questionKey: 'faq_6_question',
    answerKey: 'faq_6_answer',
  },
];

export function FAQSection() {
  const { t } = useTranslation('common');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Initialize contentRefs array based on the number of FAQs
  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, faqs.length);
  }, []);

  // Update maxHeight when openItems changes
  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        if (openItems.has(index)) {
          ref.style.maxHeight = ref.scrollHeight + 'px';
        } else {
          ref.style.maxHeight = '0px';
        }
      }
    });
  }, [openItems]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-section-headings sm:text-3xl lg:text-4xl font-bold mb-4">
            {t('faq_title', { defaultValue: 'Check out our FAQ.' })}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - First 3 cards */}
            <div className="space-y-4">
              {faqs.slice(0, 3).map((faq, index) => {
                const isOpen = openItems.has(index);

                return (
                  <div
                    key={index}
                    className="bg-card rounded-lg border shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full text-foreground px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between transition-colors duration-300"
                    >
                      <span className="font-medium text-foreground text-sm sm:text-base pr-2">
                        {t(faq.questionKey, {
                          defaultValue: faqs[index].questionKey,
                        })}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
                      )}
                    </button>

                    <div
                      ref={(el) => {
                        contentRefs.current[index] = el;
                      }}
                      className="px-4 sm:px-6 overflow-hidden transition-[max-height] duration-500 ease-in-out"
                      style={{
                        maxHeight: isOpen
                          ? `${contentRefs.current[index]?.scrollHeight}px`
                          : '0px',
                      }}
                    >
                      <p className="text-foreground text-sm sm:text-base leading-relaxed py-2">
                        {t(faq.answerKey, {
                          defaultValue: faqs[index].answerKey,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Last 3 cards */}
            <div className="space-y-4">
              {faqs.slice(3, 6).map((faq, index) => {
                const actualIndex = index + 3; // Adjust index for the second half
                const isOpen = openItems.has(actualIndex);

                return (
                  <div
                    key={actualIndex}
                    className="bg-card rounded-lg border shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(actualIndex)}
                      className="w-full text-foreground px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between transition-colors duration-300"
                    >
                      <span className="font-medium text-foreground text-sm sm:text-base pr-2">
                        {t(faq.questionKey, {
                          defaultValue: faqs[actualIndex].questionKey,
                        })}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
                      )}
                    </button>

                    <div
                      ref={(el) => {
                        contentRefs.current[actualIndex] = el;
                      }}
                      className="px-4 sm:px-6 overflow-hidden transition-[max-height] duration-500 ease-in-out"
                      style={{
                        maxHeight: isOpen
                          ? `${contentRefs.current[actualIndex]?.scrollHeight}px`
                          : '0px',
                      }}
                    >
                      <p className="text-foreground text-sm sm:text-base leading-relaxed py-2">
                        {t(faq.answerKey, {
                          defaultValue: faqs[actualIndex].answerKey,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
