// AdviserSettingsPage.tsx - Complete fixed version
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

  // FIXED: Correct image upload flow
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
      console.log("Upload response:", uploadResponse);

      // Check the response structure - it might be different
      let imageUrl;

      if (uploadResponse.data?.uri) {
        imageUrl = uploadResponse.data.uri;
      } else if (uploadResponse.data?.url) {
        imageUrl = uploadResponse.data.url;
      } else if (uploadResponse.uri) {
        imageUrl = uploadResponse.uri;
      } else if (uploadResponse.url) {
        imageUrl = uploadResponse.url;
      } else {
        console.error("Unexpected upload response structure:", uploadResponse);
        throw new Error("No image URL returned from upload");
      }

      console.log("Extracted image URL:", imageUrl);

      // Step 2: Update user profile with the image URL using PUT
      if (adviserProfile?.user?.uuid) {
        console.log("Step 2: Updating user profile with image URL");
        console.log("UUID:", adviserProfile.user.uuid);
        console.log("Image URL to send:", imageUrl);

        await updateProfileImage({
          uuid: adviserProfile.user.uuid,
          imageUrl: imageUrl,
        }).unwrap();

        toast.success("Profile image updated successfully");

        // Refresh the profile data to get the new image
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

      console.log("Original profile form:", profileForm);

      // Prepare data for backend - the slice will transform it to match backend structure
      const updateData = prepareDataForBackend(profileForm);
      console.log("Prepared profile update data:", updateData);

      // Check if there's actually data to update
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsEditingProfile(false);
        return;
      }

      const result = await updateUserProfile({
        uuid: adviserProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      console.log("Update successful:", result);
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);

      // Refresh profile data
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
      console.log("Original professional form:", professionalForm);

      // Prepare data for backend
      const updateData = prepareDataForBackend(professionalForm);
      console.log("Prepared professional update data:", updateData);

      // Check if there's actually data to update
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsEditingProfessional(false);
        return;
      }

      // Use the same user UUID for adviser details
      if (!adviserProfile?.user?.uuid) {
        toast.error("User UUID not found");
        return;
      }

      const result = await updateAdviserDetails({
        uuid: adviserProfile.user.uuid,
        updateData: updateData,
      }).unwrap();

      console.log("Professional update successful:", result);
      toast.success("Professional information updated successfully");
      setIsEditingProfessional(false);

      // Refresh profile data
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
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-[300px] w-full" />
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
        className="space-y-8"
      >
        {/* Header Section with Image Upload */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative group">
            <Image
              src={user?.imageUrl || "/placeholder.svg"}
              alt={user?.fullName || "Profile"}
              width={120}
              height={120}
              className="rounded-full border border-border/40 object-cover"
              unoptimized
            />
            <button
              onClick={handleCameraClick}
              disabled={isUpdatingImage || isUploadingFile}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {isUpdatingImage || isUploadingFile ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h1 className="text-2xl font-semibold">{user.fullName}</h1>
          <p className="text-muted-foreground text-sm">
            {adviser?.office || "Independent Researcher"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">{user.gender || "N/A"}</Badge>
            <Badge variant="secondary">
              {adviser?.experienceYears || 0} Years of Experience
            </Badge>
          </div>
        </div>

        {/* Profile Information */}
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal and contact details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              disabled={isUpdatingUser}
            >
              {isEditingProfile ? (
                <X className="h-4 w-4" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
              {isEditingProfile ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>First Name *</Label>
              {isEditingProfile ? (
                <Input
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Enter first name"
                />
              ) : (
                <Input value={user.firstName || "N/A"} disabled />
              )}
            </div>
            <div>
              <Label>Last Name *</Label>
              {isEditingProfile ? (
                <Input
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                />
              ) : (
                <Input value={user.lastName || "N/A"} disabled />
              )}
            </div>
            <div>
              <Label>Gender</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {isEditingProfile ? (
                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, gender: e.target.value })
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
            </div>
            <div>
              <Label>Email *</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input value={user.email} disabled />
                <span className="text-xs text-muted-foreground">
                  (Cannot be changed)
                </span>
              </div>
            </div>
            <div>
              <Label>Contact Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {isEditingProfile ? (
                  <Input
                    value={profileForm.contactNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="Enter contact number"
                  />
                ) : (
                  <Input
                    value={user.contactNumber || "Not provided"}
                    disabled
                  />
                )}
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {isEditingProfile ? (
                  <Input
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter address"
                  />
                ) : (
                  <Input value={user.address || "No address"} disabled />
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Bio</Label>
              {isEditingProfile ? (
                <Textarea
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  className="w-full h-24"
                />
              ) : (
                <textarea
                  className="w-full h-24 bg-muted rounded-md p-3 text-sm"
                  value={user.bio || "No biography yet"}
                  disabled
                />
              )}
            </div>
            <div>
              <Label>Telegram ID</Label>
              {isEditingProfile ? (
                <Input
                  value={profileForm.telegramId}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      telegramId: e.target.value,
                    })
                  }
                  placeholder="Enter Telegram ID"
                />
              ) : (
                <Input value={user.telegramId || "Not provided"} disabled />
              )}
            </div>

            {isEditingProfile && (
              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isUpdatingUser}
                >
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} disabled={isUpdatingUser}>
                  {isUpdatingUser ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isUpdatingUser ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Your academic or research details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfessional(!isEditingProfessional)}
              disabled={isUpdatingAdviser}
            >
              {isEditingProfessional ? (
                <X className="h-4 w-4" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
              {isEditingProfessional ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Office</Label>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {isEditingProfessional ? (
                  <Input
                    value={professionalForm.office}
                    onChange={(e) =>
                      setProfessionalForm({
                        ...professionalForm,
                        office: e.target.value,
                      })
                    }
                    placeholder="Enter office location"
                  />
                ) : (
                  <Input value={adviser?.office || "N/A"} disabled />
                )}
              </div>
            </div>
            <div>
              <Label>Experience (Years)</Label>
              {isEditingProfessional ? (
                <Input
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
                  value={`${adviser?.experienceYears || 0} Years`}
                  disabled
                />
              )}
            </div>
            <div>
              <Label>LinkedIn</Label>
              {isEditingProfessional ? (
                <Input
                  value={professionalForm.linkedinUrl}
                  onChange={(e) =>
                    setProfessionalForm({
                      ...professionalForm,
                      linkedinUrl: e.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  {adviser?.linkedinUrl ? (
                    <a
                      href={adviser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not linked</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label>Other Social Links</Label>
              {isEditingProfessional ? (
                <Textarea
                  value={professionalForm.socialLinks}
                  onChange={(e) =>
                    setProfessionalForm({
                      ...professionalForm,
                      socialLinks: e.target.value,
                    })
                  }
                  placeholder="Enter multiple links separated by commas"
                  className="h-20"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm flex items-center gap-2"
                      >
                        <Link2 className="h-4 w-4" /> {link}
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No additional links
                    </p>
                  )}
                </div>
              )}
            </div>

            {isEditingProfessional && (
              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfessional(false)}
                  disabled={isUpdatingAdviser}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProfessionalUpdate}
                  disabled={isUpdatingAdviser}
                >
                  {isUpdatingAdviser ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isUpdatingAdviser ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details (Read-only) */}
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Account metadata (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Username</Label>
              <Input value={user.userName} disabled />
            </div>
            <div>
              <Label>Telegram</Label>
              <Input value={user.telegramId || "Not provided"} disabled />
            </div>
            <div>
              <Label>Account Created</Label>
              <Input
                value={new Date(user.createDate).toLocaleDateString()}
                disabled
              />
            </div>
            <div>
              <Label>Last Updated</Label>
              <Input
                value={new Date(user.updateDate).toLocaleDateString()}
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
