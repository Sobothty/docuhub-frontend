// StudentSettingsPage.tsx - Updated with export button in header
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ProfileExport from "@/components/profiles/profileExport";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateStudentDetailsMutation,
} from "@/feature/profileSlice/profileSlice";
import {
  useUpdateProfileImageMutation,
  useCreateMediaMutation,
} from "@/feature/media/mediaSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  User,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  Download,
  Shield,
  Calendar,
  School,
  IdCard,
  Upload,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useApiNotification } from "@/components/ui/api-notification";

// Type definitions
interface ApiError {
  data?:
    | {
        message?: string;
        detail?: string;
      }
    | string;
  status?: number;
}

interface MediaUploadResponse {
  data?: {
    uri?: string;
  };
}

interface ProfileFormState {
  userName: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  contactNumber: string;
  address: string;
  bio: string;
  telegramId: string;
}

interface AcademicFormState {
  university: string;
  major: string;
  yearsOfStudy: string;
}

// Helper functions
const prepareDataForBackend = <T extends object>(data: T): Partial<T> => {
  const prepared: Partial<T> = { ...data };
  (Object.keys(prepared) as Array<keyof T>).forEach((key) => {
    if (
      prepared[key] === "" ||
      prepared[key] === null ||
      prepared[key] === undefined
    ) {
      delete prepared[key];
    }
  });
  return prepared;
};

const handleApiError = (error: unknown, defaultMessage: string): string => {
  console.error("API Error Details:", error);

  const apiError = error as ApiError;

  if (apiError?.data) {
    if (typeof apiError.data === "string") {
      return apiError.data;
    } else if (apiError.data?.message) {
      return apiError.data.message;
    } else if (apiError.data?.detail) {
      return apiError.data.detail;
    }
  }

  if (apiError?.status === 400) return "Bad request - please check your input";
  if (apiError?.status === 401) return "Unauthorized - please login again";
  if (apiError?.status === 403) return "Forbidden - you don't have permission";
  if (apiError?.status === 404) return "Resource not found";
  if (apiError?.status === 500) return "Server error - please try again later";

  return defaultMessage;
};

export default function StudentSettingsPage() {
  const {
    data: studentProfile,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery();

  const [updateUserProfile, { isLoading: isUpdatingUser }] =
    useUpdateUserProfileMutation();
  const [updateStudentDetails, { isLoading: isUpdatingStudent }] =
    useUpdateStudentDetailsMutation();

  const [updateProfileImage, { isLoading: isUpdatingImage }] =
    useUpdateProfileImageMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useCreateMediaMutation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [showExportProfile, setShowExportProfile] = useState(false);

  // Notification system
  const {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    closeNotification,
    NotificationComponent,
  } = useApiNotification();

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    userName: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    contactNumber: "",
    address: "",
    bio: "",
    telegramId: "",
  });

  const [academicForm, setAcademicForm] = useState<AcademicFormState>({
    university: "",
    major: "",
    yearsOfStudy: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize forms when data loads
  useEffect(() => {
    if (studentProfile) {
      const { user, student } = studentProfile;

      setProfileForm({
        userName: user.userName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        address: user.address || "",
        bio: user.bio || "",
        telegramId: user.telegramId || "",
      });

      setAcademicForm({
        university: student?.university || "",
        major: student?.major || "",
        yearsOfStudy: student?.yearsOfStudy?.toString() || "",
      });
    }
  }, [studentProfile]);

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!file.type.startsWith("image/")) {
      showError("Invalid File Type", "Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("File Too Large", "Image size should be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      showLoading(
        "Uploading Image",
        "Please wait while we upload your profile picture..."
      );

      console.log("Step 1: Uploading file to /media endpoint");
      const uploadResponse = (await uploadFile(
        formData
      ).unwrap()) as MediaUploadResponse;
      console.log("Upload response:", uploadResponse);

      let imageUrl: string;
      if (uploadResponse.data?.uri) {
        imageUrl = uploadResponse.data.uri;
      } else {
        console.error("Unexpected upload response structure:", uploadResponse);
        throw new Error("No image URL returned from upload");
      }

      if (studentProfile?.user?.uuid) {
        console.log("Step 2: Updating user profile with image URL");
        console.log("UUID:", studentProfile.user.uuid);
        console.log("Image URL to send:", imageUrl);

        await updateProfileImage({
          uuid: studentProfile.user.uuid,
          imageUrl: imageUrl,
        }).unwrap();

        closeNotification();
        showSuccess("Upload Successful", "Profile image updated successfully");
        refetch();
      } else {
        throw new Error("User UUID not available");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to upload profile image. Please try again."
      );
      showError("Upload Failed", errorMessage);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Profile update function
  const handleProfileUpdate = async () => {
    try {
      if (!studentProfile?.user?.uuid) {
        showError("Update Failed", "User UUID not found");
        return;
      }

      const updateData = prepareDataForBackend(profileForm);

      if (Object.keys(updateData).length === 0) {
        showInfo("No Changes", "No changes to save");
        setIsEditingProfile(false);
        return;
      }

      showLoading(
        "Updating Profile",
        "Please wait while we save your changes..."
      );
      await updateUserProfile({
        uuid: studentProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      closeNotification();
      showSuccess("Update Successful", "Profile updated successfully");
      setIsEditingProfile(false);
      refetch();
    } catch (error) {
      console.log("❌ Update error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to update profile. Please check your input and try again."
      );
      showError("Update Failed", errorMessage);
    }
  };

  // Academic update function
  const handleAcademicUpdate = async () => {
    try {
      if (!studentProfile?.user?.uuid) {
        showError("Update Failed", "User UUID not found");
        return;
      }

      const updateData = prepareDataForBackend(academicForm);

      if (Object.keys(updateData).length === 0) {
        showInfo("No Changes", "No changes to save");
        setIsEditingAcademic(false);
        return;
      }

      showLoading(
        "Updating Academic Info",
        "Please wait while we save your academic information..."
      );
      await updateStudentDetails({
        uuid: studentProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      closeNotification();
      showSuccess(
        "Update Successful",
        "Academic information updated successfully"
      );
      setIsEditingAcademic(false);
      refetch();
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to update academic information. Please check your input and try again."
      );
      showError("Update Failed", errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 text-destructive font-medium">
        Failed to load settings.{" "}
        {handleApiError(error, "Please try refreshing the page.")}
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="p-4 sm:p-6 text-destructive font-medium">
        No profile data available.
      </div>
    );
  }

  const { user, student } = studentProfile;

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.fullName || "Student"}
      userAvatar={user?.imageUrl || "/placeholder.svg"}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6"
      >
        {/* Modern Header Section */}
        <Card className="dashboard-card border-0 mb-8 overflow-hidden">
          {/* Top Accent Bar */}
          <div
            className="h-1"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />

          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Profile Image Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative flex-shrink-0"
              >
                <div className="relative group">
                  <Image
                    src={user?.imageUrl || "/placeholder.svg"}
                    alt={user?.fullName || "Profile"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-800"
                    unoptimized
                  />

                  {/* Camera Button */}
                  <button
                    onClick={handleCameraClick}
                    disabled={isUpdatingImage || isUploadingFile}
                    className="absolute bottom-1 right-1 p-2 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 hover:scale-110 border-2 border-white dark:border-gray-800"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    {isUpdatingImage || isUploadingFile ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Camera className="h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </motion.div>

              {/* User Info Section */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-1">
                  {user.fullName}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {student?.university || "University Student"}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  <Badge
                    className="gap-1 px-3 py-1 text-xs font-semibold text-white border-0"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <User className="h-3 w-3" />
                    {user.gender || "N/A"}
                  </Badge>
                  <Badge
                    className="gap-1 px-3 py-1 text-xs font-semibold text-white border-0"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <BookOpen className="h-3 w-3" />
                    {student?.major || "Undeclared"}
                  </Badge>
                  <Badge
                    className="gap-1 px-3 py-1 text-xs font-semibold text-white border-0"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <Shield className="h-3 w-3" />
                    Student
                  </Badge>
                </div>

                {/* Export Button */}
                <Button
                  onClick={() => setShowExportProfile(true)}
                  size="sm"
                  className="gap-2 text-white shadow-md hover:opacity-90 transition-opacity font-semibold border-0"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Profile Modal */}
        {showExportProfile && (
          <ProfileExport
            userType="student"
            onClose={() => setShowExportProfile(false)}
          />
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Profile Information */}
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Information Card */}
            <Card className="dashboard-card border-0 overflow-hidden">
              {/* Top Accent Bar */}
              <div
                className="h-1"
                style={{ backgroundColor: "var(--color-secondary)" }}
              />

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-card-foreground">
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Personal and contact details
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    disabled={isUpdatingUser}
                    className="gap-1.5"
                  >
                    {isEditingProfile ? (
                      <>
                        <X className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Cancel</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm sm:text-base">
                    Username
                  </Label>
                  {isEditingProfile ? (
                    <Input
                      id="username"
                      value={profileForm.userName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          userName: e.target.value,
                        })
                      }
                      placeholder="Enter username"
                      className="h-10 sm:h-12"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 sm:p-3 rounded-md bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm sm:text-base">
                        {user.userName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm sm:text-base">
                      First Name
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="First name"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={user.firstName || "N/A"}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm sm:text-base">
                      Last Name
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Last name"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={user.lastName || "N/A"}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                </div>

                {/* Gender and Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="flex items-center gap-2 text-sm sm:text-base"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Gender
                    </Label>
                    {isEditingProfile ? (
                      <select
                        id="gender"
                        value={profileForm.gender}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            gender: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 h-10 sm:h-12 border rounded-md bg-background text-sm sm:text-base"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    ) : (
                      <Input
                        value={user.gender || "N/A"}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact"
                      className="flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Contact Number
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        id="contact"
                        value={profileForm.contactNumber}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            contactNumber: e.target.value,
                          })
                        }
                        placeholder="Phone number"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={user.contactNumber || "Not provided"}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 rounded-md bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm sm:text-base">
                      {user.email}
                    </span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Read-only
                    </Badge>
                  </div>
                </div>

                {/* Telegram */}
                <div className="space-y-2">
                  <Label
                    htmlFor="telegram"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Telegram ID
                  </Label>
                  {isEditingProfile ? (
                    <Input
                      id="telegram"
                      value={profileForm.telegramId}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          telegramId: e.target.value,
                        })
                      }
                      placeholder="@username"
                      className="h-10 sm:h-12"
                    />
                  ) : (
                    <Input
                      value={user.telegramId || "Not provided"}
                      disabled
                      className="h-10 sm:h-12"
                    />
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Address
                  </Label>
                  {isEditingProfile ? (
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: e.target.value,
                        })
                      }
                      placeholder="Your address"
                      className="h-10 sm:h-12"
                    />
                  ) : (
                    <Input
                      value={user.address || "No address provided"}
                      disabled
                      className="h-10 sm:h-12"
                    />
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm sm:text-base">
                    Bio
                  </Label>
                  {isEditingProfile ? (
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself, your interests, and academic goals..."
                      className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                    />
                  ) : (
                    <div className="p-3 rounded-md bg-muted/50 min-h-[80px] sm:min-h-[100px]">
                      <p className="text-sm">
                        {user.bio ||
                          "No biography provided yet. Share something about yourself!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditingProfile && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                      disabled={isUpdatingUser}
                      size="sm"
                      className="flex-1"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfileUpdate}
                      disabled={isUpdatingUser}
                      size="sm"
                      className="flex-1 gap-1.5 text-white border-0"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      {isUpdatingUser ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Details Card */}
            <Card className="dashboard-card border-0 overflow-hidden">
              {/* Top Accent Bar */}
              <div
                className="h-1"
                style={{ backgroundColor: "var(--color-secondary)" }}
              />

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-card-foreground">
                      Account Details
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Account metadata and information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Account Created
                    </Label>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm font-medium">
                        {new Date(user.createDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Last Updated
                    </Label>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <span className="text-xs sm:text-sm font-medium">
                        {new Date(user.updateDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Academic Information */}
          <div className="space-y-4 sm:space-y-6">
            {/* Academic Information Card */}
            <Card className="dashboard-card border-0 overflow-hidden">
              {/* Top Accent Bar */}
              <div
                className="h-1"
                style={{ backgroundColor: "var(--color-secondary)" }}
              />

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-card-foreground">
                        Academic Information
                      </CardTitle>
                      <CardDescription className="text-xs">
                        University and study details
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAcademic(!isEditingAcademic)}
                    disabled={isUpdatingStudent}
                    className="gap-1.5"
                  >
                    {isEditingAcademic ? (
                      <>
                        <X className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Cancel</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* University */}
                <div className="space-y-2">
                  <Label
                    htmlFor="university"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <School className="h-4 w-4 text-muted-foreground" />
                    University
                  </Label>
                  {isEditingAcademic ? (
                    <Input
                      id="university"
                      value={academicForm.university}
                      onChange={(e) =>
                        setAcademicForm({
                          ...academicForm,
                          university: e.target.value,
                        })
                      }
                      placeholder="Your university"
                      className="h-10 sm:h-12"
                    />
                  ) : (
                    <Input
                      value={student?.university || "Not specified"}
                      disabled
                      className="h-10 sm:h-12"
                    />
                  )}
                </div>

                {/* Major and Years of Study */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="major"
                      className="flex items-center gap-2 text-sm sm:text-base"
                    >
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      Major
                    </Label>
                    {isEditingAcademic ? (
                      <Input
                        id="major"
                        value={academicForm.major}
                        onChange={(e) =>
                          setAcademicForm({
                            ...academicForm,
                            major: e.target.value,
                          })
                        }
                        placeholder="Your major"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={student?.major || "Not specified"}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="yearsOfStudy"
                      className="flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Years of Study
                    </Label>
                    {isEditingAcademic ? (
                      <Input
                        id="yearsOfStudy"
                        value={academicForm.yearsOfStudy}
                        onChange={(e) =>
                          setAcademicForm({
                            ...academicForm,
                            yearsOfStudy: e.target.value,
                          })
                        }
                        placeholder="e.g., 4"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={
                          student?.yearsOfStudy
                            ? `${student.yearsOfStudy} years`
                            : "Not specified"
                        }
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                </div>

                {/* Student Card Display */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    Student Card
                  </Label>

                  {student?.studentCardUrl ? (
                    <div className="space-y-3">
                      {/* Student Card Image Preview */}
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 bg-muted/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="relative group">
                              <Image
                                src={student.studentCardUrl}
                                alt="Student Card"
                                width={120}
                                height={80}
                                className="rounded-md object-cover border shadow-sm transition-transform group-hover:scale-105"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded transition-opacity">
                                  Preview
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Your student identification card is verified and
                              on file.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(student.studentCardUrl, "_blank")
                                }
                                className="gap-2 flex-1 sm:flex-none"
                              >
                                <IdCard className="h-4 w-4" />
                                View Full Size
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const url = student?.studentCardUrl;
                                  if (!url) {
                                    showError(
                                      "Download Failed",
                                      "Student card not available for download"
                                    );
                                    return;
                                  }

                                  // Show loading notification
                                  showLoading(
                                    "Preparing Download",
                                    "Please wait while we prepare your student card..."
                                  );

                                  try {
                                    // Fetch the file to ensure it downloads instead of previewing
                                    const response = await fetch(url);
                                    const blob = await response.blob();
                                    const downloadUrl =
                                      window.URL.createObjectURL(blob);

                                    const link = document.createElement("a");
                                    link.href = downloadUrl;
                                    link.download = `student-card-${
                                      user.userName ?? "student"
                                    }.jpg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);

                                    // Clean up the object URL
                                    window.URL.revokeObjectURL(downloadUrl);

                                    // Close loading and show success
                                    closeNotification();
                                    setTimeout(() => {
                                      showSuccess(
                                        "Download Complete!",
                                        "Your student card has been downloaded successfully."
                                      );
                                    }, 100);
                                  } catch (error) {
                                    closeNotification();
                                    setTimeout(() => {
                                      showError(
                                        "Download Failed",
                                        "Failed to download student card. Please try again."
                                      );
                                    }, 100);
                                  }
                                }}
                                className="gap-2 flex-1 sm:flex-none"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 font-medium">
                          Student card verified
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-auto bg-green-50 text-green-700 border-green-200"
                        >
                          Verified
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* No Student Card State */}
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center bg-muted/10">
                        <IdCard className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-2">
                          No student card uploaded yet
                        </p>
                        <p className="text-xs text-muted-foreground/70 mb-4">
                          Please contact administration to upload your student
                          identification card
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            showInfo(
                              "Upload Request",
                              "Please contact administration to upload your student card"
                            )
                          }
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Request Upload
                        </Button>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium">
                          Student card pending
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-auto bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Pending
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditingAcademic && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingAcademic(false)}
                      disabled={isUpdatingStudent}
                      size="sm"
                      className="flex-1"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAcademicUpdate}
                      disabled={isUpdatingStudent}
                      size="sm"
                      className="flex-1 gap-1.5 text-white border-0"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      {isUpdatingStudent ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Notification Component */}
      <NotificationComponent />
    </DashboardLayout>
  );
}
