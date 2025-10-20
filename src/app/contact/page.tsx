"use client"
import { ContactForm } from '@/components/contact/ContactForm'
// import ContactPag from '@/components/contact/ContactForm1'
import { ContactHero } from '@/components/contact/ContactHero'
import { FAQSection } from '@/components/contact/FaqSection'
import { LocationSection } from '@/components/contact/LocationSection'
import { motion, useScroll } from 'motion/react'
import React from 'react'

export default function ContactPage() {
  const { scrollYProgress } = useScroll()
  return (
    <>
    <motion.div
                    id="scroll-indicator"
                    style={{
                        scaleX: scrollYProgress,
                        position: "fixed",
                        top: 133,
                        left: 0,
                        right: 0,
                        height: 5,
                        originX: 0,
                        backgroundColor: "#f59e0b",
                        zIndex: 9999,
                    }}
                />
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