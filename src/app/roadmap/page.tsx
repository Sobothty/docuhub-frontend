"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  CheckCircle,
  MessageSquare,
  BookOpen,
  Upload,
  UserCheck,
  Settings,
  Home,
  Search,
} from "lucide-react";

interface RoadmapStep {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  gradient: string;
  position: "top" | "bottom";
}

const roadmapSteps: RoadmapStep[] = [
  {
    number: 1,
    title: "User Registration",
    description:
      "Students, advisers, and admins sign up to access the platform and begin their academic journey.",
    icon: Users,
    gradient: "from-green-500 to-teal-500",
    position: "bottom",
  },
  {
    number: 2,
    title: "Authentication",
    description:
      "Secure JWT-based login system ensures safe access to personalized dashboards and features.",
    icon: UserCheck,
    gradient: "from-blue-500 to-cyan-500",
    position: "top",
  },
  {
    number: 3,
    title: "Dashboard Access",
    description:
      "Role-based dashboards provide tailored views for students, advisers, and administrators.",
    icon: Home,
    gradient: "from-indigo-500 to-blue-600",
    position: "bottom",
  },
  {
    number: 4,
    title: "Paper Submission",
    description:
      "Students upload their research papers with metadata, categories, and supporting documents.",
    icon: Upload,
    gradient: "from-purple-500 to-pink-500",
    position: "top",
  },
  {
    number: 5,
    title: "Adviser Review",
    description:
      "Assigned advisers provide detailed feedback, comments, and suggestions for improvement.",
    icon: MessageSquare,
    gradient: "from-orange-500 to-yellow-500",
    position: "bottom",
  },
  {
    number: 6,
    title: "Adviser Approval",
    description:
      "Advisers approve papers or request revisions, ensuring quality before admin review.",
    icon: CheckCircle,
    gradient: "from-red-500 to-pink-500",
    position: "top",
  },
  {
    number: 7,
    title: "Admin Review",
    description:
      "Administrators perform final quality checks and verify compliance with standards.",
    icon: FileText,
    gradient: "from-violet-500 to-purple-600",
    position: "bottom",
  },
  {
    number: 8,
    title: "Final Approval",
    description:
      "Admin makes the final decision to publish or send back for additional revisions.",
    icon: Settings,
    gradient: "from-amber-500 to-orange-500",
    position: "top",
  },
  {
    number: 9,
    title: "Publication",
    description:
      "Approved papers are published to the public repository and made accessible to all users.",
    icon: BookOpen,
    gradient: "from-emerald-500 to-green-600",
    position: "bottom",
  },
  {
    number: 10,
    title: "Browse & Discover",
    description:
      "Users can browse, search, download, and star papers from the public repository.",
    icon: Search,
    gradient: "from-rose-500 to-red-500",
    position: "top",
  },
];

export default function RoadmapPage() {
  return (
    <div className="dashboard-background min-h-screen w-full my-3">
      {/* Header */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="dashboard-header border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl font-bold gradient-text flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              Project Roadmap
            </CardTitle>
            <CardDescription className="text-base md:text-lg mt-2">
              Interactive workflow visualization of the iPub Academic Paper
              Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                10 Steps
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Sequential Flow
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                2-Level Review
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white">
                Feedback Loops
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white">
                <BookOpen className="h-4 w-4 mr-2" />
                Publication
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Visualization */}
        <Card className="dashboard-card border-0 shadow-xl overflow-hidden mb-8">
          <CardContent className="p-8 md:p-12">
            <div className="relative">
              {/* Wavy Road Background */}
              <div className="absolute top-1/2 left-0 right-0 h-24 -translate-y-1/2 overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1200 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 Q300,20 600,50 T1200,50"
                    stroke="#374151"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="10,5"
                    className="dark:stroke-gray-600"
                  />
                </svg>
              </div>

              {/* Steps Container */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
                {roadmapSteps.map((step) => {
                  const Icon = step.icon;
                  const isEven = step.position === "top";

                  return (
                    <div
                      key={step.number}
                      className="relative flex flex-col items-center"
                    >
                      {/* Step Content */}
                      <div
                        className={`flex flex-col items-center w-full ${
                          isEven ? "order-2" : "order-1"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-20 h-20 rounded-full border-4 bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 hover:scale-110 ${
                            isEven ? "border-cyan-400" : "border-teal-400"
                          }`}
                        >
                          <Icon
                            className={`w-10 h-10 ${
                              isEven ? "text-cyan-500" : "text-teal-500"
                            }`}
                          />
                        </div>

                        {/* Title */}
                        <h3
                          className={`text-lg font-bold mb-2 text-center ${
                            isEven ? "text-primary" : "text-teal-600"
                          }`}
                        >
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-foreground text-center leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Step Badge with Pointer */}
                      <div
                        className={`relative flex items-center justify-center ${
                          isEven ? "order-1 mb-4" : "order-2 mt-4"
                        }`}
                      >
                        {/* Pointer */}
                        <div
                          className={`absolute w-0 h-0 ${
                            isEven
                              ? "bottom-0 border-l-[12px] border-r-[12px] border-t-[20px] border-t-cyan-500"
                              : "top-0 border-l-[12px] border-r-[12px] border-b-[20px] border-b-teal-500"
                          }`}
                        ></div>

                        {/* Badge */}
                        <div
                          className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl transition-transform duration-300 hover:scale-110`}
                        >
                          <div className="text-center">
                            <div className="text-white font-bold text-xs leading-tight">
                              {String(step.number).padStart(2, "0")}
                            </div>
                            <div className="text-white font-semibold text-xs leading-tight">
                              STEP
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stat-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Linear Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary">
                Clear 10-step process from registration to publication. Each
                step connects directly to the next, ensuring a straightforward
                and predictable workflow for all users.
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Two-Level Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Papers undergo adviser review first, then admin final approval.
                Feedback loops at both levels allow for revisions, ensuring
                high-quality publications through iterative improvement.
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                Public Repository
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once approved, papers are published to a public repository where
                anyone can browse, search, download, and star papers. Final step
                makes research accessible to all.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
