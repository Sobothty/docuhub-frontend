
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
  AtSign,
  MessageCircle,
  Calendar,
  Shield,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

// Enhanced helper function to safely prepare data for backend
const prepareDataForBackend = (data: any) => {
  const prepared = { ...data };

  // Convert empty strings, null, and undefined to be removed
  Object.keys(prepared).forEach((key) => {
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

// Enhanced error handler
const handleApiError = (error: any, defaultMessage: string) => {
  console.error("API Error Details:", {
    status: error?.status,
    data: error?.data,
    originalError: error,
  });

  if (error?.data) {
    if (typeof error.data === "string") {
      return error.data;
    } else if (error.data?.message) {
      return error.data.message;
    } else if (error.data?.detail) {
      return error.data.detail;
    }
  }

  if (error?.status === 400) return "Bad request - please check your input";
  if (error?.status === 401) return "Unauthorized - please login again";
  if (error?.status === 403) return "Forbidden - you don't have permission";
  if (error?.status === 404) return "Resource not found";
  if (error?.status === 500) return "Server error - please try again later";
  if (error?.status === 502)
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

  const [profileForm, setProfileForm] = useState({
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

  const [professionalForm, setProfessionalForm] = useState({
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
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      // Step 1: Upload the image file to /media endpoint
      const formData = new FormData();
      formData.append("file", file);

      toast.info("Uploading image...");

      console.log("Step 1: Uploading file to /media endpoint");
      const uploadResponse = await uploadFile(formData).unwrap();

      // Extract image URL from response
      let imageUrl;
      if (uploadResponse.data?.uri) {
        imageUrl = uploadResponse.data.uri;
      } else if (uploadResponse.uri) {
        imageUrl = uploadResponse.uri;
      } else if ('url' in uploadResponse) {
        imageUrl = uploadResponse.url;
      } else if (uploadResponse.data && 'url' in uploadResponse.data) {
        imageUrl = uploadResponse.data.url;
      } else {
        throw new Error("No image URL returned from upload");
      }

      // Step 2: Update user profile with the image URL
      if (adviserProfile?.user?.uuid) {
        await updateProfileImage({
          uuid: adviserProfile.user.uuid,
          imageUrl: imageUrl,
        }).unwrap();

        toast.success("Profile image updated successfully");
        refetch();
      } else {
        throw new Error("User UUID not available");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
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

  // Profile update function
  const handleProfileUpdate = async () => {
    try {
      if (!adviserProfile?.user?.uuid) {
        toast.error("User UUID not found");
        return;
      }

      // Prepare data for backend
      const updateData = prepareDataForBackend(profileForm);

      // Check if there's actually data to update
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsEditingProfile(false);
        return;
      }

      await updateUserProfile({
        uuid: adviserProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
      refetch();
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to update profile. Please check your input and try again."
      );
      toast.error(errorMessage);
    }
  };

  // Professional update function
  const handleProfessionalUpdate = async () => {
    try {
      // Prepare data for backend
      const updateData = prepareDataForBackend(professionalForm);

      // Check if there's actually data to update
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsEditingProfessional(false);
        return;
      }

      if (!adviserProfile?.user?.uuid) {
        toast.error("User UUID not found");
        return;
      }

      await updateAdviserDetails({
        uuid: adviserProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      toast.success("Professional information updated successfully");
      setIsEditingProfessional(false);
      refetch();
    } catch (error: any) {
      console.error("Professional update error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to update professional information. Please check your input and try again."
      );
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Profile loading error:", error);
    return (
      <div className="p-6 text-destructive font-medium">
        Failed to load settings.{" "}
        {handleApiError(error, "Please try refreshing the page.")}
      </div>
    );
  }

  if (!adviserProfile) {
    return (
      <div className="p-6 text-destructive font-medium">
        No profile data available.
      </div>
    );
  }

  const { user, adviser } = adviserProfile;
  const socialLinks =
    adviser?.socialLinks?.split(",").map((link) => link.trim()) || [];

  return (
    <DashboardLayout
      userRole="adviser"
      userName={user?.fullName || "Adviser"}
      userAvatar={user?.imageUrl || "/placeholder.svg"}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-6xl mx-auto"
      >
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            className="relative inline-block group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Image
                src={user?.imageUrl || "/placeholder.svg"}
                alt={user?.fullName || "Profile"}
                width={140}
                height={140}
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
              {user.fullName}
            </h1>
            <p className="text-lg text-muted-foreground">
              {adviser?.office || "Independent Researcher"}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" />
                {user.gender || "N/A"}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Briefcase className="h-3 w-3" />
                {adviser?.experienceYears || 0} Years Exp
              </Badge>
              <Badge variant="default" className="gap-1">
                <Shield className="h-3 w-3" />
                Professional Adviser
              </Badge>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Better Organization */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Profile Information */}
          <div className="space-y-6">
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
                      Your personal and contact details
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    disabled={isUpdatingUser}
                    className="gap-2"
                  >
                    {isEditingProfile ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Edit2 className="h-4 w-4" />
                    )}
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
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
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.userName}</span>
                    </div>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
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
                      />
                    ) : (
                      <Input value={user.firstName || "N/A"} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
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
                      />
                    ) : (
                      <Input value={user.lastName || "N/A"} disabled />
                    )}
                  </div>
                </div>

                {/* Gender and Contact */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2">
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
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    ) : (
                      <Input value={user.gender || "N/A"} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact"
                      className="flex items-center gap-2"
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
                      />
                    ) : (
                      <Input
                        value={user.contactNumber || "Not provided"}
                        disabled
                      />
                    )}
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.email}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Cannot be changed
                    </Badge>
                  </div>
                </div>

                {/* Telegram */}
                <div className="space-y-2">
                  <Label htmlFor="telegram" className="flex items-center gap-2">
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
                    <Input value={user.telegramId || "Not provided"} disabled />
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
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
                    />
                  ) : (
                    <Input
                      value={user.address || "No address provided"}
                      disabled
                    />
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditingProfile ? (
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself, your expertise, and experience..."
                      className="min-h-[100px] resize-none"
                    />
                  ) : (
                    <div className="p-3 rounded-md bg-muted/50 min-h-[100px]">
                      <p className="text-sm">
                        {user.bio ||
                          "No biography provided yet. Share something about yourself!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditingProfile && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                      disabled={isUpdatingUser}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfileUpdate}
                      disabled={isUpdatingUser}
                      className="flex-1 gap-2"
                    >
                      {isUpdatingUser ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isUpdatingUser ? "Saving..." : "Save Changes"}
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
                  Account metadata and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Account Created
                    </Label>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
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
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Last Updated
                    </Label>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
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
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    User ID
                  </Label>
                  <div className="p-2 rounded-md bg-muted/50">
                    <code className="text-xs font-mono text-muted-foreground break-all">
                      {user.uuid}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Professional Information */}
          <div className="space-y-6">
            {/* Professional Information Card */}
            <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Professional Information
                    </CardTitle>
                    <CardDescription>
                      Your academic and professional details
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIsEditingProfessional(!isEditingProfessional)
                    }
                    disabled={isUpdatingAdviser}
                    className="gap-2"
                  >
                    {isEditingProfessional ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Edit2 className="h-4 w-4" />
                    )}
                    {isEditingProfessional ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Office and Experience */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="office" className="flex items-center gap-2">
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
                      />
                    ) : (
                      <Input
                        value={adviser?.office || "Not specified"}
                        disabled
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="experience"
                      className="flex items-center gap-2"
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
                      />
                    ) : (
                      <Input
                        value={`${adviser?.experienceYears || 0} years`}
                        disabled
                      />
                    )}
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
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
                    />
                  ) : adviser?.linkedinUrl ? (
                    <a
                      href={adviser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <Link2 className="h-4 w-4" />
                      <span className="font-medium">View LinkedIn Profile</span>
                    </a>
                  ) : (
                    <div className="p-2 rounded-md bg-muted/50">
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
                    className="flex items-center gap-2"
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
                      className="min-h-[80px] resize-none"
                    />
                  ) : (
                    <div className="space-y-2">
                      {socialLinks.length > 0 ? (
                        socialLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors group"
                          >
                            <Link2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfessional(false)}
                      disabled={isUpdatingAdviser}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfessionalUpdate}
                      disabled={isUpdatingAdviser}
                      className="flex-1 gap-2"
                    >
                      {isUpdatingAdviser ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isUpdatingAdviser ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Account Status
                </CardTitle>
                <CardDescription>
                  Your current account permissions and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <span className="font-medium text-green-800">Status</span>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adviser Role</span>
                    <Badge variant="secondary">Professional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Profile Completion
                    </span>
                    <Badge variant="outline">
                      {user.bio && user.contactNumber && user.address
                        ? "Complete"
                        : "Incomplete"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
