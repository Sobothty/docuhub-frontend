"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  CreateStudentDetailRequest,
  UpdateStudentDetailRequest,
  useCreateStudentDetailMutation,
  useUpdateStudentDetailMutation,
  useGetStudentDetailByUserQuery,
} from "@/feature/users/studentSlice";
import {
  useCreateMediaMutation,
  useDeleteMediaMutation,
} from "@/feature/media/mediaSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { StudentFormData, StudentFormErrors } from "@/types/studentType";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Image from "next/image";
import { useWebSocket } from "@/components/providers/WebSocketProvider";

interface StudentVerificationFormProps {
  userUuid?: string;
  onSuccess?: () => void;
  isUpdate?: boolean;
}

const UNIVERSITIES = [
  "Institute of Technology Science and Advanced Development",
  "Royal University of Phnom Penh",
  "University of Cambodia",
  "Cambodia University of Technology",
  "Institute of Technology of Cambodia",
  "American University of Cambodia",
  "University of Management and Economics",
  "Build Bright University",
  "Other",
];

const YEARS_OF_STUDY = ["1", "2", "3", "4", "5", "6"];

export default function StudentVerificationForm({
  userUuid,
  onSuccess,
  isUpdate = false,
}: StudentVerificationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Use global WebSocket provider
  const { sendPrivateMessage, isConnected } = useWebSocket();

  // Get current user UUID
  const currentUserUuid = userUuid || session?.user?.id || "";

  // Always check if student detail exists
  const {
    data: existingStudentDetail,
    isLoading: isLoadingExisting,
    refetch: refetchStudentDetail,
  } = useGetStudentDetailByUserQuery(currentUserUuid, {
    skip: !currentUserUuid,
  });

  const [createStudentDetail, { isLoading: isCreating }] =
    useCreateStudentDetailMutation();

  const [updateStudentDetail, { isLoading: isUpdating }] =
    useUpdateStudentDetailMutation();

  const [createMedia, { isLoading: isUploadingMedia }] =
    useCreateMediaMutation();

  const [deleteMedia, { isLoading: isDeletingMedia }] =
    useDeleteMediaMutation();

  const [formData, setFormData] = useState<CreateStudentDetailRequest>({
    studentCardUrl: "",
    university: "",
    major: "",
    yearsOfStudy: "",
    userUuid: currentUserUuid,
  });

  const [formErrors, setFormErrors] = useState<StudentFormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadedMediaName, setUploadedMediaName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [hasExistingRecord, setHasExistingRecord] = useState<boolean>(false);

  // Determine if we should use update mode
  const shouldUseUpdate = isUpdate || !!existingStudentDetail;

  // Populate form with existing data when student detail exists
  useEffect(() => {
    if (existingStudentDetail) {
      setFormData({
        studentCardUrl: existingStudentDetail.studentCardUrl,
        university: existingStudentDetail.university,
        major: existingStudentDetail.major,
        yearsOfStudy: existingStudentDetail.yearsOfStudy,
        userUuid: currentUserUuid,
      });
      setPreviewUrl(existingStudentDetail.studentCardUrl);
      setHasExistingRecord(true);
    }
  }, [existingStudentDetail, currentUserUuid]);

  const validateForm = (): boolean => {
    const errors: StudentFormErrors = {};

    if (!formData.studentCardUrl.trim()) {
      errors.studentCardUrl = "Student card image is required";
    }

    if (!formData.university.trim()) {
      errors.university = "University is required";
    }

    if (!formData.major.trim()) {
      errors.major = "Major is required";
    }

    if (!formData.yearsOfStudy) {
      errors.yearsOfStudy = "Years of study is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setFormErrors((prev) => ({
        ...prev,
        studentCardUrl: "Please upload a valid image file (JPEG, JPG, or PNG)",
      }));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setFormErrors((prev) => ({
        ...prev,
        studentCardUrl: "File size must be less than 5MB",
      }));
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file using the media API
      const response = await createMedia(formData).unwrap();

      // Set the uploaded URL from the response
      handleInputChange("studentCardUrl", response.data.uri);
      setUploadedMediaName(response.data.name);
      setPreviewUrl(response.data.uri);

      console.log("File uploaded successfully:", response.data.uri);
    } catch (error) {
      console.log("Upload failed:", error);
      setFormErrors((prev) => ({
        ...prev,
        studentCardUrl: "Failed to upload file. Please try again.",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploadedFile = async () => {
    if (!uploadedMediaName) return;

    try {
      await deleteMedia(uploadedMediaName).unwrap();
      handleInputChange("studentCardUrl", "");
      setUploadedMediaName("");
      setPreviewUrl("");
      console.log("File deleted successfully");
    } catch (error) {
      console.log("Delete failed:", error);
      setFormErrors((prev) => ({
        ...prev,
        studentCardUrl: "Failed to delete file. Please try again.",
      }));
    }
  };

  // Admin UUID for notifications
  const ADMIN_UUID = "8f4dc8f0-007e-408c-a562-e7709d75a3a8";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentUserUuid) {
      console.log("User UUID not found");
      return;
    }

    try {
      let result;

      // Smart logic: Use UPDATE if record exists, otherwise CREATE
      if (shouldUseUpdate) {
        // Update existing student detail using PATCH with user UUID
        const updateData: UpdateStudentDetailRequest = {
          studentCardUrl: formData.studentCardUrl,
          university: formData.university,
          major: formData.major,
          yearsOfStudy: formData.yearsOfStudy,
          userUuid: currentUserUuid,
        };

        console.log("Updating student detail with user UUID:", currentUserUuid);
        result = await updateStudentDetail({
          uuid: currentUserUuid,
          data: updateData,
        }).unwrap();
      } else {
        // Create new student detail
        console.log(
          "Creating new student detail with user UUID:",
          currentUserUuid
        );
        result = await createStudentDetail({
          studentCardUrl: formData.studentCardUrl,
          university: formData.university,
          major: formData.major,
          yearsOfStudy: formData.yearsOfStudy,
          userUuid: currentUserUuid,
        }).unwrap();
      }

      // Send notification to admin via WebSocket
      if (isConnected) {
        const notificationMessage = {
          type: "STUDENT_VERIFICATION",
          action: shouldUseUpdate ? "updated" : "submitted",
          message:
            result.message ||
            `New student verification ${
              shouldUseUpdate ? "update" : "request"
            } from ${formData.university}`,
          studentInfo: {
            university: formData.university,
            major: formData.major,
            yearsOfStudy: formData.yearsOfStudy,
            userUuid: currentUserUuid,
          },
          timestamp: new Date().toISOString(),
        };

        console.log(
          "📤 Sending WebSocket notification to admin:",
          notificationMessage
        );
        sendPrivateMessage(ADMIN_UUID, JSON.stringify(notificationMessage));
      } else {
        console.warn("⚠️ WebSocket not connected, notification not sent");
      }

      setSubmitSuccess(true);
      console.log(
        `Student verification ${
          shouldUseUpdate ? "updated" : "submitted"
        } successfully:`,
        result
      );

      // Refetch student detail to get updated data
      refetchStudentDetail();

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/profile");
        }
      }, 2000);
    } catch (error) {
      console.log(
        `Failed to ${
          shouldUseUpdate ? "update" : "submit"
        } student verification:`,
        error
      );

      // Handle duplicate key error - switch to update mode
      const err = error as FetchBaseQueryError & {
        originalStatus?: number;
        status?: string | number;
        data?: { detail?: string };
      };

      if (
        err.data?.detail?.includes("duplicate key") ||
        err.data?.detail?.includes("constraint")
      ) {
        console.log("Duplicate record detected, switching to update mode");
        setHasExistingRecord(true);

        // Retry with update
        try {
          const updateData: UpdateStudentDetailRequest = {
            studentCardUrl: formData.studentCardUrl,
            university: formData.university,
            major: formData.major,
            yearsOfStudy: formData.yearsOfStudy,
            userUuid: currentUserUuid,
          };

          const result = await updateStudentDetail({
            uuid: currentUserUuid,
            data: updateData,
          }).unwrap();

          // Send notification to admin via WebSocket
          if (isConnected) {
            const notificationMessage = {
              type: "STUDENT_VERIFICATION",
              action: "updated",
              message:
                result.message ||
                `Student verification update from ${formData.university}`,
              studentInfo: {
                university: formData.university,
                major: formData.major,
                yearsOfStudy: formData.yearsOfStudy,
                userUuid: currentUserUuid,
              },
              timestamp: new Date().toISOString(),
            };

            console.log(
              "📤 Sending WebSocket notification to admin (retry):",
              notificationMessage
            );
            sendPrivateMessage(ADMIN_UUID, JSON.stringify(notificationMessage));
          }

          setSubmitSuccess(true);
          refetchStudentDetail();

          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.push("/profile");
            }
          }, 2000);
          return;
        } catch (retryError) {
          console.log("Retry with update also failed:", retryError);
        }
      }

      // Handle the case where the request was successful but parsing failed
      if (
        err.originalStatus === 200 ||
        err.originalStatus === 201 ||
        err.status === "PARSING_ERROR"
      ) {
        // Send notification to admin via WebSocket (request was successful)
        if (isConnected) {
          const notificationMessage = {
            type: "STUDENT_VERIFICATION",
            action: shouldUseUpdate ? "updated" : "submitted",
            message: `New student verification ${
              shouldUseUpdate ? "update" : "request"
            } from ${formData.university}`,
            studentInfo: {
              university: formData.university,
              major: formData.major,
              yearsOfStudy: formData.yearsOfStudy,
              userUuid: currentUserUuid,
            },
            timestamp: new Date().toISOString(),
          };

          console.log(
            "📤 Sending WebSocket notification to admin (parsing error case):",
            notificationMessage
          );
          sendPrivateMessage(ADMIN_UUID, JSON.stringify(notificationMessage));
        }

        setSubmitSuccess(true);
        console.log(
          `Student verification ${
            shouldUseUpdate ? "updated" : "submitted"
          } successfully (parsing error ignored)`
        );

        refetchStudentDetail();

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/profile");
          }
        }, 2000);
      }
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingExisting;
  const isSubmitting = isLoading || isUploading || isUploadingMedia;

  if (isLoadingExisting && isUpdate) {
    return (
      <Card className="dashboard-card border-0 max-w-2xl mx-auto overflow-hidden">
        <div
          className="h-1"
          style={{ backgroundColor: "var(--color-secondary)" }}
        />
        <CardContent className="p-8 text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-3 mx-auto mb-4"
            style={{ borderColor: "var(--color-secondary)" }}
          ></div>
          <p className="text-muted-foreground font-medium">
            Loading your student information...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (submitSuccess) {
    return (
      <Card className="dashboard-card border-0 max-w-2xl mx-auto overflow-hidden">
        <div
          className="h-1"
          style={{ backgroundColor: "var(--color-secondary)" }}
        />
        <CardContent className="p-8 text-center">
          <div
            className="inline-flex p-4 rounded-full mb-4"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            {shouldUseUpdate
              ? "Verification Updated Successfully!"
              : "Verification Submitted Successfully!"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {shouldUseUpdate
              ? "Your student verification request has been updated. Our admin team will review your updated documents."
              : "Your student verification request has been submitted. Our admin team will review your documents and notify you of the result."}
          </p>
          <Badge
            className="px-4 py-2 text-sm font-semibold !rounded-full"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "white",
            }}
          >
            Status:{" "}
            {shouldUseUpdate ? "Updated - Pending Review" : "Pending Review"}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card border-0 max-w-3xl mx-auto overflow-hidden">
      {/* Top Accent Bar */}
      <div
        className="h-1"
        style={{ backgroundColor: "var(--color-secondary)" }}
      />

      <CardHeader className="pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="p-2.5 rounded-lg flex-shrink-0"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  {shouldUseUpdate
                    ? "Update Student Verification"
                    : "Student Verification"}
                </CardTitle>
                {hasExistingRecord && (
                  <Badge
                    className="px-2.5 py-0.5 text-xs font-semibold !rounded-full"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "white",
                    }}
                  >
                    Existing Application
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {shouldUseUpdate
                  ? "Update your student information to get verified and access student features."
                  : "Submit your student information to get verified and access student features."}
              </p>
              {hasExistingRecord && (
                <Alert className="mt-3 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-sm text-yellow-700 dark:text-yellow-300">
                    You already have a pending application. Updating will
                    replace your previous submission.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Card Upload */}
          <div className="space-y-3">
            <Label
              htmlFor="studentCard"
              className="flex items-center gap-2 text-base font-semibold"
            >
              <div
                className="p-1 rounded"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                <Upload className="h-3.5 w-3.5 text-white" />
              </div>
              Student Card Image
              <span className="text-red-500">*</span>
            </Label>

            {/* Preview Image */}
            {previewUrl && (
              <div className="relative w-full max-w-lg mx-auto p-4 rounded-lg bg-muted/30">
                <Image
                  src={previewUrl}
                  alt="Student card preview"
                  className="w-full h-auto rounded-lg border-2 border-border shadow-md"
                  width={500}
                  height={300}
                  unoptimized
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteUploadedFile}
                  disabled={isDeletingMedia}
                  className="absolute top-6 right-6 h-9 w-9 p-0 rounded-full shadow-lg"
                >
                  {isDeletingMedia ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* Upload Area */}
            {!previewUrl && (
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors bg-muted/20">
                <input
                  id="studentCard"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading || isUploadingMedia}
                />
                <Label
                  htmlFor="studentCard"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div
                    className="p-4 rounded-full"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isUploading || isUploadingMedia
                        ? "Uploading your student card..."
                        : "Click to upload your student card"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPEG, PNG (max 5MB)
                    </p>
                  </div>
                </Label>
              </div>
            )}

            {formErrors.studentCardUrl && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-sm text-red-700 dark:text-red-300">
                  {formErrors.studentCardUrl}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* University */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4 text-muted-foreground" />
                University
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.university}
                onValueChange={(value) =>
                  handleInputChange("university", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  {UNIVERSITIES.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.university && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.university}
                </p>
              )}
            </div>

            {/* Years of Study */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Years of Study
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.yearsOfStudy}
                onValueChange={(value) =>
                  handleInputChange("yearsOfStudy", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS_OF_STUDY.map((year) => (
                    <SelectItem key={year} value={year}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.yearsOfStudy && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.yearsOfStudy}
                </p>
              )}
            </div>
          </div>

          {/* Major - Full Width */}
          <div className="space-y-2">
            <Label
              htmlFor="major"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Major
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="major"
              type="text"
              placeholder="e.g., Computer Science, Engineering, Business Administration"
              value={formData.major}
              onChange={(e) => handleInputChange("major", e.target.value)}
              className="h-11"
            />
            {formErrors.major && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.major}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 text-white border-0 font-semibold"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {shouldUseUpdate ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  {shouldUseUpdate ? (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {shouldUseUpdate
                    ? "Update Verification"
                    : "Submit Verification"}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="sm:w-32 h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
