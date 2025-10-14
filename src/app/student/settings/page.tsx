"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  User,
  GraduationCap,
  Upload,
  Camera,
  Loader2,
  X,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useState, useEffect } from "react";
import { toast } from "sonner";
// Import the new mutations from your updated slice
import {
  useUpdateProfileMutation,
  useUploadMediaMutation,
} from "@/feature/apiSlice/studentApi"; // Update the import path
import Image from "next/image";

interface UserProfileForm {
  userName: string;
  gender: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  bio: string;
  address: string;
  contactNumber: string;
  telegramId: string;
}

export default function StudentSettingsPage() {
  const {
    data: user,
    refetch,
    isLoading: isLoadingUser,
  } = useGetUserProfileQuery();

  // Use the new mutations from studentApi
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadMedia, { isLoading: isUploadingMedia }] =
    useUploadMediaMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfileForm>({
    userName: "",
    gender: "",
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    bio: "",
    address: "",
    contactNumber: "",
    telegramId: "",
  });

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.user.userName || "",
        gender: user.user.gender || "",
        email: user.user.email || "",
        fullName: user.user.fullName || "",
        firstName: user.user.firstName || "",
        lastName: user.user.lastName || "",
        bio: user.user.bio || "",
        address: user.user.address || "",
        contactNumber: user.user.contactNumber || "",
        telegramId: user.user.telegramId || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfileForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!user?.user.uuid) {
        toast.error("User ID not found");
        return;
      }

      // Prepare update data - only include fields that have changed
      const updateData: any = {};

      if (formData.userName !== user.user.userName)
        updateData.userName = formData.userName;
      if (formData.gender !== user.user.gender)
        updateData.gender = formData.gender;
      if (formData.email !== user.user.email) updateData.email = formData.email;
      if (formData.fullName !== user.user.fullName)
        updateData.fullName = formData.fullName;
      if (formData.firstName !== user.user.firstName)
        updateData.firstName = formData.firstName;
      if (formData.lastName !== user.user.lastName)
        updateData.lastName = formData.lastName;
      if (formData.bio !== user.user.bio) updateData.bio = formData.bio;
      if (formData.address !== user.user.address)
        updateData.address = formData.address;
      if (formData.contactNumber !== user.user.contactNumber)
        updateData.contactNumber = formData.contactNumber;
      if (formData.telegramId !== user.user.telegramId)
        updateData.telegramId = formData.telegramId;

      // Check if there are any changes
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes detected");
        setIsEditing(false);
        return;
      }

      console.log("Sending update data:", updateData);

      // Use the new updateProfile mutation
      await updateProfile({
        uuid: user.user.uuid,
        data: updateData,
      }).unwrap();

      await refetch();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      if (error.data?.message) {
        toast.error(`Failed to update profile: ${error.data.message}`);
      } else if (error.status === 405) {
        toast.error(
          "Server method not allowed. Please check API configuration."
        );
      } else {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImage || !user?.user.uuid) {
        toast.error("Please select an image first");
        return;
      }

      console.log("Starting image upload...");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedImage);

      // Upload the image using the new uploadMedia mutation
      const uploadResponse = await uploadMedia(formData).unwrap();

      console.log("Image uploaded successfully:", uploadResponse);

      // If upload was successful, update the user's profile with the new image URL
      if (uploadResponse.url) {
        await updateProfile({
          uuid: user.user.uuid,
          data: { imageUrl: uploadResponse.url },
        }).unwrap();

        await refetch();
        setSelectedImage(null);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        toast.success("Profile image updated successfully!");
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error: any) {
      console.error("Failed to update image:", error);
      if (error.data?.message) {
        toast.error(`Failed to update image: ${error.data.message}`);
      } else if (error.status === 405) {
        toast.error(
          "Image upload method not allowed. Please try a different approach."
        );
      } else {
        toast.error("Failed to update profile image");
      }
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (isLoadingUser) {
    return (
      <DashboardLayout
        userRole="student"
        userName="Loading..."
        userAvatar="/placeholder.svg?height=40&width=40"
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-slate-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole="student"
      userName={user?.user.fullName || "User"}
      userAvatar={user?.user.imageUrl || "/placeholder.svg?height=40&width=40"}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
              Account Settings
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Manage your profile, academic information, and account preferences
              in one place
            </p>
          </div>

          {/* Profile Image Section - Top of both sides */}
          <Card className="shadow-lg border-slate-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>
                Profile Picture
              </CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={
                        imagePreview ||
                        user?.user.imageUrl ||
                        "/placeholder.svg"
                      }
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      unoptimized
                      width={160}
                      height={160}
                    />
                    <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center">
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        <Camera className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex gap-3 flex-wrap">
                      <Label
                        htmlFor="profile-image"
                        className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Upload className="h-5 w-5" />
                        Choose Image
                      </Label>
                      <Button
                        onClick={handleImageUpload}
                        disabled={!selectedImage || isUploadingMedia}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                      >
                        {isUploadingMedia ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}
                        Update Picture
                      </Button>
                      {selectedImage && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            if (imagePreview) {
                              URL.revokeObjectURL(imagePreview);
                            }
                            setImagePreview(null);
                          }}
                          className="text-red-600 border-red-300 hover:bg-red-50 px-6 py-3"
                        >
                          <X className="h-5 w-5" />
                          Cancel
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      Recommended: Square image, at least 400x400 pixels, max
                      5MB
                    </p>
                  </div>

                  {selectedImage && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Image selected: {selectedImage.name} (
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3-Column Grid Layout for Profile and Academic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left and Middle Columns - Profile Information (2 columns) */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-slate-200 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 w-full"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-base">
                        Update your personal and public profile information
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className={
                        isEditing
                          ? "border-red-500 text-red-600 hover:bg-red-50"
                          : ""
                      }
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="userName" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="userName"
                        value={formData.userName}
                        onChange={(e) =>
                          handleInputChange("userName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-sm font-medium">
                        Gender
                      </Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full h-12 px-3 border border-slate-300 rounded-md bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="contactNumber"
                        className="text-sm font-medium"
                      >
                        Contact Number
                      </Label>
                      <Input
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="telegramId"
                        className="text-sm font-medium"
                      >
                        Telegram ID
                      </Label>
                      <Input
                        id="telegramId"
                        value={formData.telegramId}
                        onChange={(e) =>
                          handleInputChange("telegramId", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter Telegram ID"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 border-slate-300 focus:border-blue-500 transition-colors"
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={3}
                        className="border-slate-300 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isUpdating ? "Updating..." : "Save Profile"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Academic Information */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-slate-200 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 w-full"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-purple-600" />
                    </div>
                    Academic Information
                  </CardTitle>
                  <CardDescription className="text-base">
                    Your academic details and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="university"
                        className="text-sm font-medium"
                      >
                        University
                      </Label>
                      <Input
                        id="university"
                        value={user?.student?.university || ""}
                        disabled
                        className="h-12 bg-slate-50 border-slate-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="major" className="text-sm font-medium">
                        Major
                      </Label>
                      <Input
                        id="major"
                        value={user?.student?.major || ""}
                        disabled
                        className="h-12 bg-slate-50 border-slate-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="yearsOfStudy"
                        className="text-sm font-medium"
                      >
                        Years of Study
                      </Label>
                      <Input
                        id="yearsOfStudy"
                        value={user?.student?.yearsOfStudy?.toString() || ""}
                        disabled
                        className="h-12 bg-slate-50 border-slate-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="studentCard"
                        className="text-sm font-medium"
                      >
                        Student Card
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="studentCard"
                          value="View Student Card"
                          disabled
                          className="h-12 bg-slate-50 border-slate-300"
                        />
                        {user?.student?.studentCardUrl && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                user.student!.studentCardUrl,
                                "_blank"
                              )
                            }
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
