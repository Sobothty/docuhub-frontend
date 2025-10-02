"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const getLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'kh':
        return { flag: '🇰🇭', name: 'ខ្មែរ' }
      case 'en':
      default:
        return { flag: '🇺🇸', name: 'English' }
    }
  }

  const currentLang = getLanguageDisplay()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Globe className="h-4 w-4" />
          <span className="ml-2">
            <span className="mr-1">{currentLang.flag}</span>
            {currentLang.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage("en")}
          className={currentLanguage === 'en' ? 'bg-accent/10' : ''}
        >
          <span className="mr-2">🇺🇸</span>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage("kh")}
          className={currentLanguage === 'kh' ? 'bg-accent/10' : ''}
        >
          <span className="mr-2">🇰🇭</span>
          <span>ខ្មែរ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
