// PublicProfileSettings.tsx - Refined version
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
  User,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  AtSign,
  MessageCircle,
  Calendar,
  Shield,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

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

// Helper function to safely prepare data for backend
const prepareDataForBackend = <T extends object>(data: T): Partial<T> => {
  const prepared: Partial<T> = { ...data };

  (Object.keys(prepared) as Array<keyof T>).forEach((key) => {
    const value = prepared[key];
    if (value === "" || value === null || value === undefined) {
      Reflect.deleteProperty(prepared as object, key as PropertyKey);
    }
  });

  return prepared;
};

// Enhanced error handler
const handleApiError = (error: unknown, defaultMessage: string): string => {
  console.log("API Error Details:", { error });

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
  if (apiError?.status === 502) return "Network error - please check your connection";

  return defaultMessage;
};

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function PublicProfileSettings() {
  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery();

  const [updateUserProfile, { isLoading: isUpdatingUser }] = useUpdateUserProfileMutation();
  const [updateProfileImage, { isLoading: isUpdatingImage }] = useUpdateProfileImageMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useCreateMediaMutation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize forms when data loads
  useEffect(() => {
    if (userProfile) {
      const { user } = userProfile;

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

      // Validate initial email
      if (user.email) {
        setIsEmailValid(isValidEmail(user.email));
      }
    }
  }, [userProfile]);

  // Image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      toast.info("Uploading image...");

      const uploadResponse = (await uploadFile(formData).unwrap()) as MediaUploadResponse;

      let imageUrl: string;
      if (uploadResponse.data?.uri) {
        imageUrl = uploadResponse.data.uri;
      } else if (uploadResponse.uri) {
        imageUrl = uploadResponse.uri;
      } else if (uploadResponse.url) {
        imageUrl = uploadResponse.url;
      } else if (uploadResponse.data?.url) {
        imageUrl = uploadResponse.data.url;
      } else {
        throw new Error("No image URL returned from upload");
      }

      if (userProfile?.user?.uuid) {
        await updateProfileImage({
          uuid: userProfile.user.uuid,
          imageUrl: imageUrl,
        }).unwrap();

        toast.success("Profile image updated successfully");
        refetch();
      } else {
        throw new Error("User UUID not available");
      }
    } catch (error) {
      console.log("Image upload error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to upload profile image. Please try again."
      );
      toast.error(errorMessage);
    }
  };

  // Trigger file input click when camera icon is clicked
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle email change with validation
  const handleEmailChange = (email: string) => {
    setProfileForm(prev => ({ ...prev, email }));
    setEmailTouched(true);
    setIsEmailValid(isValidEmail(email));
  };

  // Profile update function
  const handleProfileUpdate = async () => {
    // Validate email before submission
    if (!isValidEmail(profileForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      if (!userProfile?.user?.uuid) {
        toast.error("User UUID not found");
        return;
      }

      const updateData = prepareDataForBackend(profileForm);

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsEditingProfile(false);
        return;
      }

      await updateUserProfile({
        uuid: userProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
      setEmailTouched(false);
      refetch();
    } catch (error) {
      console.log("Update error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to update profile. Please check your input and try again."
      );
      toast.error(errorMessage);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // Reset form to original data
    if (userProfile) {
      const { user } = userProfile;
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
      setIsEmailValid(isValidEmail(user.email || ""));
    }
    setEmailTouched(false);
    setIsEditingProfile(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Profile loading error:", error);
    return (
      <div className="p-6 text-destructive font-medium">
        Failed to load settings.{" "}
        {handleApiError(error, "Please try refreshing the page.")}
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6 text-destructive font-medium">
        No profile data available.
      </div>
    );
  }

  const { user } = userProfile;

  return (
    <DashboardLayout
      userRole="public"
      userName={user?.userName || "User"}
      userAvatar={user?.imageUrl || "/placeholder.svg"}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            className="relative inline-block group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Image
                src={user?.imageUrl || "/placeholder.svg"}
                alt={user?.userName || "Profile"}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-lg object-cover"
                unoptimized
              />
              <button
                onClick={handleCameraClick}
                disabled={isUpdatingImage || isUploadingFile}
                className="absolute bottom-2 right-2 bg-primary rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUpdatingImage || isUploadingFile ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Camera className="h-4 w-4 text-white" />
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

          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.userName}
            </h1>
            <p className="text-lg text-muted-foreground">Public User</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" />
                {user.gender || "Not specified"}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Verified Account
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your personal information and contact details
                </CardDescription>
              </div>
              <Button
                variant={isEditingProfile ? "outline" : "default"}
                size="sm"
                onClick={() => 
                  isEditingProfile ? handleCancelEdit() : setIsEditingProfile(true)
                }
                disabled={isUpdatingUser}
                className="gap-2"
              >
                {isEditingProfile ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                <AtSign className="h-4 w-4 text-muted-foreground" />
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
                  placeholder="Enter your username"
                  className="transition-colors"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.userName}</span>
                </div>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
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
                    placeholder="Your first name"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <span className={user.firstName ? "font-medium" : "text-muted-foreground"}>
                      {user.firstName || "Not provided"}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
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
                    placeholder="Your last name"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <span className={user.lastName ? "font-medium" : "text-muted-foreground"}>
                      {user.lastName || "Not provided"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Gender and Contact */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
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
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <span className={user.gender ? "font-medium" : "text-muted-foreground"}>
                      {user.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : "Not specified"}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact" className="flex items-center gap-2 text-sm font-medium">
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
                    placeholder="Your phone number"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-muted/30 border">
                    <span className={user.contactNumber ? "font-medium" : "text-muted-foreground"}>
                      {user.contactNumber || "Not provided"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field - Editable */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              {isEditingProfile ? (
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`transition-colors ${
                      emailTouched && !isEmailValid
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-input focus:ring-primary/20"
                    }`}
                  />
                  {emailTouched && !isEmailValid && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="h-3 w-3" />
                      Please enter a valid email address
                    </div>
                  )}
                  {emailTouched && isEmailValid && profileForm.email && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="h-3 w-3" />
                      Valid email address
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.email}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Verified
                  </Badge>
                </div>
              )}
            </div>

            {/* Telegram */}
            <div className="space-y-2">
              <Label htmlFor="telegram" className="flex items-center gap-2 text-sm font-medium">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
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
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border">
                  <span className={user.telegramId ? "font-medium" : "text-muted-foreground"}>
                    {user.telegramId || "Not provided"}
                  </span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
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
                  placeholder="Your complete address"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border min-h-[44px]">
                  <span className={user.address ? "font-medium" : "text-muted-foreground"}>
                    {user.address || "No address provided"}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              {isEditingProfile ? (
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself, your interests, and background..."
                  className="min-h-[120px] resize-none"
                />
              ) : (
                <div className="p-4 rounded-lg bg-muted/30 border min-h-[120px]">
                  <p className={user.bio ? "text-foreground leading-relaxed" : "text-muted-foreground italic"}>
                    {user.bio || "No biography provided yet. Share something about yourself!"}
                  </p>
                </div>
              )}
            </div>

            {/* Save Button */}
            {isEditingProfile && (
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdatingUser}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingUser || (emailTouched && !isEmailValid)}
                  className="flex-1 gap-2"
                >
                  {isUpdatingUser ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your account metadata and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Account Created
                  </Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Date(user.createDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Last Updated
                  </Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Date(user.updateDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                User ID
              </Label>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <code className="text-xs font-mono text-muted-foreground break-all">
                  {user.uuid}
                </code>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Account Status
                </Label>
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Check className="h-3 w-3 mr-1" />
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  User Type
                </Label>
                <Badge variant="outline" className="text-xs">
                  Public User
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}