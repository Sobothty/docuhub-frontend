// AdviserSettingsPage.tsx - Modern UI matching student settings
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
  useUpdateAdviserDetailsMutation,
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
  Briefcase,
  Link2,
  User,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  Globe,
  MessageCircle,
  Calendar,
  Shield,
  Download,
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
    url?: string;
  };
  uri?: string;
  url?: string;
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

interface ProfessionalFormState {
  office: string;
  experienceYears: number;
  linkedinUrl: string;
  socialLinks: string;
}

// Helper function to safely prepare data for backend
const prepareDataForBackend = <T extends object>(data: T): Partial<T> => {
  const prepared: Partial<T> = { ...data };

  // Convert empty strings, null, and undefined to be removed
  (Object.keys(prepared) as Array<keyof T>).forEach((key) => {
    const value = prepared[key];
    if (value === "" || value === null || value === undefined) {
      // use a safe cast to allow deletion from the Partial<T> object
      Reflect.deleteProperty(prepared as object, key as PropertyKey);
    }
  });

  return prepared;
};

// Enhanced error handler
const handleApiError = (error: unknown, defaultMessage: string): string => {
  console.error("API Error Details:", {
    error,
  });

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
  if (apiError?.status === 502)
    return "Network error - please check your connection";

  return defaultMessage;
};

export default function AdviserSettingsPage() {
  const {
    data: adviserProfile,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery();

  const [updateUserProfile, { isLoading: isUpdatingUser }] =
    useUpdateUserProfileMutation();
  const [updateAdviserDetails, { isLoading: isUpdatingAdviser }] =
    useUpdateAdviserDetailsMutation();

  const [updateProfileImage, { isLoading: isUpdatingImage }] =
    useUpdateProfileImageMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useCreateMediaMutation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
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

  const [professionalForm, setProfessionalForm] =
    useState<ProfessionalFormState>({
      office: "",
      experienceYears: 0,
      linkedinUrl: "",
      socialLinks: "",
    });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize forms when data loads
  useEffect(() => {
    if (adviserProfile) {
      const { user, adviser } = adviserProfile;

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

      setProfessionalForm({
        office: adviser?.office || "",
        experienceYears: adviser?.experienceYears || 0,
        linkedinUrl: adviser?.linkedinUrl || "",
        socialLinks: adviser?.socialLinks || "",
      });
    }
  }, [adviserProfile]);

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

      if (adviserProfile?.user?.uuid) {
        console.log("Step 2: Updating user profile with image URL");
        console.log("UUID:", adviserProfile.user.uuid);
        console.log("Image URL to send:", imageUrl);

        await updateProfileImage({
          uuid: adviserProfile.user.uuid,
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

  // Trigger file input click when camera icon is clicked
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Profile update function
  const handleProfileUpdate = async () => {
    try {
      if (!adviserProfile?.user?.uuid) {
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
        uuid: adviserProfile.user.uuid,
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

  // Professional update function
  const handleProfessionalUpdate = async () => {
    try {
      if (!adviserProfile?.user?.uuid) {
        showError("Update Failed", "User UUID not found");
        return;
      }

      const updateData = prepareDataForBackend(professionalForm);

      if (Object.keys(updateData).length === 0) {
        showInfo("No Changes", "No changes to save");
        setIsEditingProfessional(false);
        return;
      }

      showLoading(
        "Updating Professional Info",
        "Please wait while we save your professional information..."
      );
      await updateAdviserDetails({
        uuid: adviserProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      closeNotification();
      showSuccess(
        "Update Successful",
        "Professional information updated successfully"
      );
      setIsEditingProfessional(false);
      refetch();
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to update professional information. Please check your input and try again."
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

  if (!adviserProfile) {
    return (
      <div className="p-4 sm:p-6 text-destructive font-medium">
        No profile data available.
      </div>
    );
  }

  const { user, adviser } = adviserProfile;
  const socialLinks =
    adviser?.socialLinks?.split(",").map((link: string) => link.trim()) || [];

  return (
    <DashboardLayout
      userRole="adviser"
      userName={user?.fullName || "Adviser"}
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
                    className="w-[120px] h-[120px] rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-800"
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
                  {adviser?.office || "Independent Researcher"}
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
                    <Briefcase className="h-3 w-3" />
                    {adviser?.experienceYears || 0} Years Exp
                  </Badge>
                  <Badge
                    className="gap-1 px-3 py-1 text-xs font-semibold text-white border-0"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <Shield className="h-3 w-3" />
                    Adviser
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
            userType="adviser"
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
                      placeholder="Tell us about yourself, your expertise, and experience..."
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

          {/* Right Column - Professional Information */}
          <div className="space-y-4 sm:space-y-6">
            {/* Professional Information Card */}
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
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-card-foreground">
                        Professional Information
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Academic and professional details
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIsEditingProfessional(!isEditingProfessional)
                    }
                    disabled={isUpdatingAdviser}
                    className="gap-1.5"
                  >
                    {isEditingProfessional ? (
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
                {/* Office and Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="office"
                      className="flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Office / Institution
                    </Label>
                    {isEditingProfessional ? (
                      <Input
                        id="office"
                        value={professionalForm.office}
                        onChange={(e) =>
                          setProfessionalForm({
                            ...professionalForm,
                            office: e.target.value,
                          })
                        }
                        placeholder="Your office or institution"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={adviser?.office || "Not specified"}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="experience"
                      className="flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Experience (Years)
                    </Label>
                    {isEditingProfessional ? (
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        max="50"
                        value={professionalForm.experienceYears}
                        onChange={(e) =>
                          setProfessionalForm({
                            ...professionalForm,
                            experienceYears: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <Input
                        value={`${adviser?.experienceYears || 0} years`}
                        disabled
                        className="h-10 sm:h-12"
                      />
                    )}
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label
                    htmlFor="linkedin"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    LinkedIn Profile
                  </Label>
                  {isEditingProfessional ? (
                    <Input
                      id="linkedin"
                      value={professionalForm.linkedinUrl}
                      onChange={(e) =>
                        setProfessionalForm({
                          ...professionalForm,
                          linkedinUrl: e.target.value,
                        })
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="h-10 sm:h-12"
                    />
                  ) : adviser?.linkedinUrl ? (
                    <a
                      href={adviser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 sm:p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm sm:text-base truncate">
                        {adviser.linkedinUrl}
                      </span>
                    </a>
                  ) : (
                    <div className="p-2 sm:p-3 rounded-md bg-muted/50">
                      <span className="text-sm text-muted-foreground">
                        No LinkedIn profile added
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <Label
                    htmlFor="socialLinks"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Other Social Links
                  </Label>
                  {isEditingProfessional ? (
                    <Textarea
                      id="socialLinks"
                      value={professionalForm.socialLinks}
                      onChange={(e) =>
                        setProfessionalForm({
                          ...professionalForm,
                          socialLinks: e.target.value,
                        })
                      }
                      placeholder="Enter multiple links separated by commas"
                      className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                    />
                  ) : (
                    <div className="space-y-2">
                      {socialLinks.length > 0 ? (
                        socialLinks.map((link: string, i: number) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 sm:p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors group"
                          >
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium truncate">
                              {link}
                            </span>
                          </a>
                        ))
                      ) : (
                        <div className="p-3 rounded-md bg-muted/50 text-center">
                          <p className="text-sm text-muted-foreground">
                            No additional social links added
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditingProfessional && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfessional(false)}
                      disabled={isUpdatingAdviser}
                      size="sm"
                      className="flex-1"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfessionalUpdate}
                      disabled={isUpdatingAdviser}
                      size="sm"
                      className="flex-1 gap-1.5 text-white border-0"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    >
                      {isUpdatingAdviser ? (
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
