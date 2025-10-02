import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import Providers from './providers';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';

// English: Poppins
const poppins = Poppins({
  variable: '--font-english',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const kantumroyPro = localFont({
  src: [
    {
      path: '../fonts/KantumroyPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/KantumroyPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-khmer',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DocuHub - Academic Resource Platform',
    template: '%s | DocuHub',
  },
  description:
    'DocuHub is your trusted platform for discovering academic documents, sharing research, and connecting with mentors. Access thousands of scholarly papers and educational tools in one place.',
  keywords: [
    'DocuHub',
    'academic resources',
    'scholarly papers',
    'research platform',
    'education tools',
    'mentorship',
    'Khmer education',
    'academic collaboration',
  ],
  authors: [{ name: 'DocuHub Team', url: 'https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D' }],
  creator: 'DocuHub Team',
  publisher: 'DocuHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'DocuHub - Discover, Share, and Connect',
    description:
      'Join DocuHub to access a vast repository of academic papers, share your research, and connect with mentors and students worldwide.',
    url: 'https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D',
    siteName: 'DocuHub',
    images: [
      {
        url: 'https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D',
        width: 1200,
        height: 630,
        alt: 'DocuHub Academic Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
    alternateLocale: ['km_KH'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocuHub - Academic Resource Platform',
    description:
      'Explore academic papers, share research, and connect with mentors on DocuHub.',
    images: ['https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D'],
    creator: '@DocuHubTeam',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/placeholder.svg',
    shortcut: '/placeholder.svg',
    apple: '/placeholder.svg',
  },
  alternates: {
    canonical: 'https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D',
    languages: {
      'en-US': 'https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D',
      'km-KH': 'https://scontent.fpnh8-3.fna.fbcdn.net/v/t39.30808-6/489823128_674025992044571_2949088916256174211_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFa7nVgzrAwkXIitmMZqKA4ParLbrbCR0A9qstutsJHQFBOWAyZhwaaAfHvQV-2zamdQi6AgOpgDSFHy7J9RirY&_nc_ohc=AT7WUSnv1DYQ7kNvwHFD_s2&_nc_oc=AdlF_iA4-_JQRstkBGVeLl-wHLqDwGuYP1TOu8HcQns_56FjWaQPGqeWBrxdGmTQNZU&_nc_zt=23&_nc_ht=scontent.fpnh8-3.fna&_nc_gid=y07fOjx8uMHUnaDinm8gRw&oh=00_AfaoXg6IsNgRnn4jmaBfWaicVe_ZlQOiZDBQ-PyaBueogg&oe=68C6FB9D',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Hreflang for multilingual SEO */}
        <link
          rel="alternate"
          hrefLang="en-US"
          href="https://www.cstad.edu.kh/"
        />
        <link
          rel="alternate"
          hrefLang="km-KH"
          href="https://www.cstad.edu.kh/"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.cstad.edu.kh/"
        />
        {/* Additional meta tags */}
        <meta name="theme-color" content="#2563EB" />
        <meta name="application-name" content="DocuHub" />
        <meta name="apple-mobile-web-app-title" content="DocuHub" />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${kantumroyPro.variable} antialiased`}
      >
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
