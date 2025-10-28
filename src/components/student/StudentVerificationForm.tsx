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
    error: studentDetailError,
    refetch: refetchStudentDetail,
  } = useGetStudentDetailByUserQuery(currentUserUuid, {
    skip: !currentUserUuid,
  });

  const [createStudentDetail, { isLoading: isCreating, error: createError }] =
    useCreateStudentDetailMutation();

  const [updateStudentDetail, { isLoading: isUpdating, error: updateError }] =
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

  // Use the appropriate error based on mode
  const mutationError = shouldUseUpdate ? updateError : createError;

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
      if (isConnected && result.message) {
        sendPrivateMessage(ADMIN_UUID, result.message);
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

          if (isConnected && result.message) {
            sendPrivateMessage(ADMIN_UUID, result.message);
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
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading your student information...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            {shouldUseUpdate
              ? "Verification Updated Successfully!"
              : "Verification Submitted Successfully!"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {shouldUseUpdate
              ? "Your student verification request has been updated. Our admin team will review your updated documents."
              : "Your student verification request has been submitted. Our admin team will review your documents and notify you of the result."}
          </p>
          <Badge variant="outline" className="text-yellow-600">
            Status:{" "}
            {shouldUseUpdate ? "Updated - Pending Review" : "Pending Review"}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          {shouldUseUpdate
            ? "Update Student Verification"
            : "Student Verification"}
          {hasExistingRecord && (
            <Badge variant="outline" className="ml-2 text-xs">
              Existing Application
            </Badge>
          )}
        </CardTitle>
        <p className="text-muted-foreground">
          {shouldUseUpdate
            ? "Update your student information to get verified and access student features."
            : "Submit your student information to get verified and access student features."}
          {hasExistingRecord && (
            <span className="block mt-1 text-yellow-600 text-sm">
              You already have a pending application. Updating will replace your
              previous submission.
            </span>
          )}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Card Upload */}
          <div className="space-y-2">
            <Label htmlFor="studentCard" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Student Card Image *
            </Label>

            {/* Preview Image */}
            {previewUrl && (
              <div className="relative w-full max-w-md mx-auto mb-4">
                <Image
                  src={previewUrl}
                  alt="Student card preview"
                  className="w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm"
                  width={400}
                  height={400}
                  unoptimized
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteUploadedFile}
                  disabled={isDeletingMedia}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-accent/70 hover:bg-accent/90 flex items-center justify-center rounded-full"
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {isUploading || isUploadingMedia
                      ? "Uploading..."
                      : "Click to upload your student card (JPEG, PNG, max 5MB)"}
                  </span>
                </Label>
              </div>
            )}

            {formErrors.studentCardUrl && (
              <p className="text-sm text-red-500">
                {formErrors.studentCardUrl}
              </p>
            )}
          </div>

          {/* University */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              University *
            </Label>
            <Select
              value={formData.university}
              onValueChange={(value) => handleInputChange("university", value)}
            >
              <SelectTrigger>
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
              <p className="text-sm text-red-500">{formErrors.university}</p>
            )}
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Major *
            </Label>
            <Input
              id="major"
              type="text"
              placeholder="e.g., Computer Science, Engineering, Business"
              value={formData.major}
              onChange={(e) => handleInputChange("major", e.target.value)}
            />
            {formErrors.major && (
              <p className="text-sm text-red-500">{formErrors.major}</p>
            )}
          </div>

          {/* Years of Study */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Years of Study *
            </Label>
            <Select
              value={formData.yearsOfStudy}
              onValueChange={(value) =>
                handleInputChange("yearsOfStudy", value)
              }
            >
              <SelectTrigger>
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
              <p className="text-sm text-red-500">{formErrors.yearsOfStudy}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1  text-white bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {shouldUseUpdate ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  {shouldUseUpdate ? (
                    <RefreshCw className="h-4 w-4 mr-2 text-white" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2 text-white" />
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
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
