'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export function ContactForm() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add API call or further processing here
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-section-headings mb-4">
          {t('send_us_a_message', { defaultValue: 'Send Us a Message' })}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('contact_form_description', {
            defaultValue:
              'Have a question, suggestion, or need assistance? Fill out the form below and our team will get back to you promptly.',
          })}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Contact Form - Left Side */}
          <div className="flex items-center">
            <div className="w-full h-[500px] lg:h-[600px] rounded-lg p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t('contact_form_fields', { defaultValue: 'Contact Form' })}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('full_name_label', { defaultValue: 'Full Name' })}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('full_name_placeholder', {
                      defaultValue: 'Enter your full name',
                    })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('email_label', { defaultValue: 'Email' })}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('email_placeholder', {
                      defaultValue: 'Enter your email',
                    })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('subject_label', { defaultValue: 'Subject' })}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('subject_placeholder', {
                      defaultValue: 'Enter subject',
                    })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('message_label', { defaultValue: 'Message' })}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('message_placeholder', {
                      defaultValue: 'Enter your message',
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none bg-background text-foreground placeholder-muted-foreground"
                  />
                </div>

                <div className="pt-5">
                  <Button
                    type="submit"
                    className="w-full py-6 px-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                  >
                    {t('submit_button', { defaultValue: 'Submit' })}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Section - Right Side */}
          <div className="flex items-center">
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
              <Image
                src="/contactUs/inputFormPic.gif"
                alt={t('contact_image_alt', {
                  defaultValue: 'Person working on laptop',
                })}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-section-headings mb-2">Professional Team</h4>
                <p className="text-subheadings opacity-90">
                  Ready to help you succeed and achieve your goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
