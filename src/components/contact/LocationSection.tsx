'use client';

import { MapPin, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LocationSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('reach_us_directly', { defaultValue: 'Reach Us Directly' })}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find us easily and get in touch with our team
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <div className="h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.631478132756!2d104.89921187481747!3d11.578254588623496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951e96d257a6f%3A0x6b66703c5fc0c7cc!2sScience%20and%20Technology%20Advanced%20Development%20Co.%2C%20Ltd.!5e0!3m2!1sen!2skh!4v1756431275512!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="order-1 lg:order-2">
            <div className="rounded-xl p-8 h-full">
              <div className="mb-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Contact Information
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {t('visit_our_place', { defaultValue: 'Visit Our Place' })}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('visit_description', {
                    defaultValue:
                      'Discover a welcoming space to learn, share, and connect. At Docuhub, ideas grow and collaboration thrives.',
                  })}
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {t('address_label', { defaultValue: 'Address' })}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('address_value', {
                        defaultValue: '123 Business Street\nCity, State 12345',
                      })}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {t('email_label', { defaultValue: 'Email' })}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('email_value', {
                        defaultValue: 'contact@docuhub.com',
                      })}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {t('phone_label', { defaultValue: 'Phone' })}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('phone_value', { defaultValue: '+1 (555) 123-4567' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
