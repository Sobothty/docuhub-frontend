"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Toast {
  id: number
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: number) => void
}

let toastContext: ToastContextType = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now()
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  toastContext = { toasts, addToast, removeToast }

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-green-500"
      case "error":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
    }
  }

  return (
    <div
      className={`bg-background border border-border rounded-lg shadow-lg p-4 min-w-80 max-w-md border-l-4 ${getBorderColor()} animate-in slide-in-from-right-full`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.message && <p className="text-xs text-muted-foreground mt-1">{toast.message}</p>}
          {toast.action && (
            <Button size="sm" variant="outline" onClick={toast.action.onClick} className="mt-2 bg-transparent">
              {toast.action.label}
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => onRemove(toast.id)} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

// Export toast function for easy use
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) =>
    toastContext.addToast({ type: "success", title, message, ...options }),
  error: (title: string, message?: string, options?: Partial<Toast>) =>
    toastContext.addToast({ type: "error", title, message, ...options }),
  warning: (title: string, message?: string, options?: Partial<Toast>) =>
    toastContext.addToast({ type: "warning", title, message, ...options }),
  info: (title: string, message?: string, options?: Partial<Toast>) =>
    toastContext.addToast({ type: "info", title, message, ...options }),
}
