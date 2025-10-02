"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rules?: ValidationRule
  error?: string
  success?: boolean
  disabled?: boolean
  multiline?: boolean
  rows?: number
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  rules,
  error,
  disabled,
  multiline,
  rows = 3,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false)

  const validateField = (val: string): string | null => {
    if (!rules) return null

    if (rules.required && !val.trim()) {
      return `${label} is required`
    }

    if (rules.minLength && val.length < rules.minLength) {
      return `${label} must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && val.length > rules.maxLength) {
      return `${label} must be no more than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(val)) {
      return `${label} format is invalid`
    }

    if (rules.custom) {
      return rules.custom(val)
    }

    return null
  }

  const validationError = touched ? validateField(value) : null
  const displayError = error || validationError
  const isValid = !displayError && value.length > 0 && touched

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(displayError && "text-destructive")}>
        {label}
        {rules?.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="relative">
        {multiline ? (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={disabled}
            rows={rows}
            className={cn(
              displayError && "border-destructive focus-visible:ring-destructive",
              isValid && "border-green-500 focus-visible:ring-green-500",
            )}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={disabled}
            className={cn(
              displayError && "border-destructive focus-visible:ring-destructive",
              isValid && "border-green-500 focus-visible:ring-green-500",
            )}
          />
        )}

        {isValid && <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />}

        {displayError && <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />}
      </div>

      {displayError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {displayError}
        </p>
      )}
    </div>
  )
}

export function FormErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

export function FormSuccess({ message }: { message: string }) {
  return (
    <Alert className="border-green-500 bg-green-50 text-green-800">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
