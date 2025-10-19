"use client";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, Phone, School, User } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetStudentProfileQuery } from "@/feature/apiSlice/authApi";

export default function MentorStudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: adviserProfile } = useGetUserProfileQuery();
  const { data, error, isLoading } = useGetStudentProfileQuery(id);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[70vh] text-lg font-medium text-muted-foreground animate-pulse">
        Loading student profile...
      </div>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout
        userRole="adviser"
        userName={adviserProfile?.user?.fullName || "Adviser"}
        userAvatar={adviserProfile?.user?.imageUrl || "/placeholder.svg"}
      >
        <div className="p-6 text-red-500 font-medium text-center text-lg">
          ⚠️ Failed to load student profile.
        </div>
      </DashboardLayout>
    );
  }

  const { user, student } = data;

  return (
    <DashboardLayout
      userRole="adviser"
      userName={adviserProfile?.user?.fullName || "Adviser"}
      userAvatar={adviserProfile?.user?.imageUrl || "/placeholder.svg"}
    >
      <motion.div
        className="space-y-8 px-4 sm:px-6 lg:px-10 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back button */}
        <Button
          variant="ghost"
          className="hover:bg-accent transition"
          onClick={() => router.push("/adviser/students")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assigned Students
        </Button>

        {/* Profile Header */}
        <motion.div
          className="relative bg-gradient-to-r bg-blue-600 rounded-2xl text-white overflow-hidden shadow-xl"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex flex-col md:flex-row items-center md:items-end md:justify-between px-8 py-8 gap-6">
            <div className="flex items-center gap-5">
              <Image
                src={user.imageUrl || "/placeholder.svg"}
                alt={user.fullName}
                width={130}
                height={130}
                className="rounded-full border-4 border-white shadow-lg object-cover"
                unoptimized
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {user.fullName}
                </h1>
                <p className="text-sm text-blue-100">@{user.userName}</p>
                <p className="mt-1 text-sm opacity-90">
                  {student?.university || "Unknown University"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {student?.major && (
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
                  🎓 {student.major}
                </span>
              )}
              {student?.yearsOfStudy && (
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
                  📅 {student.yearsOfStudy} Years
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Student Details Card */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-md bg-white/60 border-0 shadow-md hover:shadow-lg transition rounded-2xl">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic contact and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{user.fullName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              {user.contactNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.contactNumber}</span>
                </div>
              )}

              {user.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
              )}

              {user.telegramId && (
                <div className="flex items-center gap-2">
                  <Image
                    src="/telegram.svg"
                    alt="Telegram"
                    width={18}
                    height={18}
                    className="opacity-80"
                  />
                  <span>{user.telegramId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bio section */}
          <Card className="backdrop-blur-md bg-white/60 border-0 shadow-md hover:shadow-lg transition rounded-2xl">
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Student introduction and bio</CardDescription>
            </CardHeader>
            <CardContent>
              {user.bio ? (
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No bio available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Card */}
        {student?.studentCardUrl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-md bg-white/70 border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Student ID Card</CardTitle>
                <CardDescription>Uploaded by {user.fullName}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <motion.div
                  className="rounded-lg border shadow-sm overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Image
                    src={student.studentCardUrl}
                    alt="Student Card"
                    width={420}
                    height={260}
                    className="object-contain"
                    unoptimized
                  />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
