import { ContactForm } from '@/components/contact/ContactForm'
// import ContactPag from '@/components/contact/ContactForm1'
import { ContactHero } from '@/components/contact/ContactHero'
import { FAQSection } from '@/components/contact/FaqSection'
import { LocationSection } from '@/components/contact/LocationSection'
import React from 'react'

export default function ContactPage() {
  return (
    <>
    <main className="min-h-screen">
      <ContactHero/>
      {/* <ContactPag/> */} 
      <ContactForm/>
      <LocationSection/>
      <FAQSection/>

    </main>
    </>
  )
}