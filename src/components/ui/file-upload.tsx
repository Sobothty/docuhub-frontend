"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onFilesChange?: (files: File[]) => void
  disabled?: boolean
  className?: string
}

interface UploadedFile {
  file: File
  id: string
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

export function FileUpload({
  accept = ".pdf,.doc,.docx",
  maxSize = 10,
  maxFiles = 1,
  onFilesChange,
  disabled,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || disabled) return

    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(newFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxSize}MB)`)
        return
      }

      // Check file type
      if (accept && !accept.split(",").some((type) => file.name.toLowerCase().endsWith(type.replace(".", "")))) {
        errors.push(`${file.name} is not a supported file type`)
        return
      }

      validFiles.push(file)
    })

    if (validFiles.length + files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Add new files
    const newUploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "uploading",
      progress: 0,
    }))

    const updatedFiles = [...files, ...newUploadedFiles]
    setFiles(updatedFiles)

    // Simulate upload progress
    newUploadedFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id)
    })

    onFilesChange?.(updatedFiles.map((f) => f.file))
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100)
            const isComplete = newProgress >= 100

            return {
              ...file,
              progress: newProgress,
              status: isComplete ? "success" : "uploading",
            }
          }
          return file
        }),
      )
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, progress: 100, status: "success" } : file)),
      )
    }, 2000)
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles.map((f) => f.file))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Max {maxSize}MB</Badge>
            <Badge variant="outline">{accept}</Badge>
            <Badge variant="outline">Max {maxFiles} files</Badge>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile) => (
            <Card key={uploadedFile.id} className="p-4">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {uploadedFile.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    {uploadedFile.status === "uploading" && (
                      <>
                        <span>•</span>
                        <span>{Math.round(uploadedFile.progress)}%</span>
                      </>
                    )}
                  </div>
                  {uploadedFile.status === "uploading" && (
                    <Progress value={uploadedFile.progress} className="h-1 mt-2" />
                  )}
                  {uploadedFile.error && <p className="text-xs text-destructive mt-1">{uploadedFile.error}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
