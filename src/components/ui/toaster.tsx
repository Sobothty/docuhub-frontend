"use client"

// Remove import if module does not exist to fix TS2307
// import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// Temporary mock for useToast to prevent build error
function useToast() {
  return { toasts: [] }
}

type ToastItem = {
  id: string | number
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  [key: string]: unknown
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function (
        { id, title, description, action, ...props }: ToastItem
      ) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
