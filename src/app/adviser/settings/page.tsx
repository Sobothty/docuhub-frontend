"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { Mail, Phone, MapPin, Link2, Briefcase } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AdviserProfilePage() {
  const { data: adviserProfile, isLoading, error } = useGetUserProfileQuery();

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading profile...</div>;
  }

  if (error || !adviserProfile) {
    return (
      <div className="p-6 text-destructive font-medium">
        Failed to load profile data.
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
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-3"
        >
          <Image
            src={user?.imageUrl || "/placeholder.svg"}
            alt={user?.fullName || "Profile"}
            width={120}
            height={120}
            className="rounded-full border border-border/40 object-cover"
            unoptimized
          />
          <h1 className="text-2xl font-semibold">{user.fullName}</h1>
          <p className="text-muted-foreground text-sm">
            {adviser?.office || "Independent Researcher"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">{user.gender || "Not specified"}</Badge>
            <Badge variant="secondary">
              {adviser?.experienceYears || 0} Years of Experience
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About */}
          <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Basic personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Full Name
                </Label>
                <p className="text-base font-medium">{user.fullName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="flex items-center gap-2 text-base font-medium">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.email}
                </p>
              </div>

              {user.contactNumber && user.contactNumber !== "null" && (
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Contact Number
                  </Label>
                  <p className="flex items-center gap-2 text-base font-medium">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.contactNumber}
                  </p>
                </div>
              )}

              {user.address && (
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Address
                  </Label>
                  <p className="flex items-center gap-2 text-base font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {user.address}
                  </p>
                </div>
              )}

              {user.bio && (
                <div>
                  <Label className="text-sm text-muted-foreground">Bio</Label>
                  <p className="text-base leading-relaxed">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Research & Social */}
          <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Expertise, experience, and online presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Office</Label>
                <p className="flex items-center gap-2 text-base font-medium">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {adviser?.office || "No office information"}
                </p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  LinkedIn
                </Label>
                <a
                  href={adviser?.linkedinUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-base flex items-center gap-2"
                >
                  <Link2 className="h-4 w-4" />{" "}
                  {adviser?.linkedinUrl || "Not linked"}
                </a>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  Other Social Links
                </Label>
                <div className="flex flex-col gap-2 mt-1">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((link, idx) => (
                      <a
                        key={idx}
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
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="lg:col-span-2 border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How students or collaborators can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Telegram
                </Label>
                <p className="text-base font-medium">
                  {user.telegramId || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Experience
                </Label>
                <p className="text-base font-medium">
                  {adviser?.experienceYears || 0} years in research & mentoring
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
