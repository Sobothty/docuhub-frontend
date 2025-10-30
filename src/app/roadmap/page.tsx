"use client";

import { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  FileText,
  CheckCircle,
  MessageSquare,
  BookOpen,
  Upload,
  UserCheck,
  Star,
  Settings,
} from "lucide-react";

const iconSize = 20;

// Custom Node Data Type
interface NodeData {
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  type?: string;
  width?: number;
}

// Custom Node Component
const CustomNode = ({ data }: { data: NodeData }) => {
  const Icon = data.icon;

  return (
    <div
      className={`px-6 py-4 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        data.type === "start"
          ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white"
          : data.type === "process"
          ? "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 text-white"
          : data.type === "decision"
          ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 text-white"
          : data.type === "end"
          ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      }`}
      style={{ minWidth: data.width || 200 }}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="flex-shrink-0" size={iconSize} />}
        <div className="flex-1">
          <div className="font-bold text-sm mb-1">{data.label}</div>
          {data.description && (
            <div className="text-xs opacity-90">{data.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  // Step 1: Start
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 0 },
    data: {
      label: "User Registration",
      description: "Student/Adviser/Admin signup",
      icon: Users,
      type: "start",
      width: 240,
    },
  },

  // Step 2: Authentication
  {
    id: "2",
    type: "custom",
    position: { x: 400, y: 120 },
    data: {
      label: "Login & Authentication",
      description: "JWT-based secure login",
      icon: UserCheck,
      type: "process",
      width: 240,
    },
  },

  // Step 3: Dashboard Access
  {
    id: "3",
    type: "custom",
    position: { x: 400, y: 240 },
    data: {
      label: "User Dashboard",
      description: "Role-based dashboard view",
      icon: Home,
      type: "process",
      width: 240,
    },
  },

  // Step 4: Submit Paper
  {
    id: "4",
    type: "custom",
    position: { x: 400, y: 360 },
    data: {
      label: "Submit Paper",
      description: "Student uploads research",
      icon: Upload,
      type: "process",
      width: 240,
    },
  },

  // Step 5: Adviser Review
  {
    id: "5",
    type: "custom",
    position: { x: 400, y: 480 },
    data: {
      label: "Adviser Review",
      description: "Provide feedback & comments",
      icon: MessageSquare,
      type: "process",
      width: 240,
    },
  },

  // Step 6: Adviser Decision
  {
    id: "6",
    type: "custom",
    position: { x: 400, y: 600 },
    data: {
      label: "Adviser Approval",
      description: "Approve or request revision",
      icon: CheckCircle,
      type: "decision",
      width: 240,
    },
  },

  // Step 7: Admin Review
  {
    id: "7",
    type: "custom",
    position: { x: 400, y: 720 },
    data: {
      label: "Admin Review",
      description: "Final quality check",
      icon: FileText,
      type: "process",
      width: 240,
    },
  },

  // Step 8: Admin Decision
  {
    id: "8",
    type: "custom",
    position: { x: 400, y: 840 },
    data: {
      label: "Final Approval",
      description: "Publish or send back",
      icon: Settings,
      type: "decision",
      width: 240,
    },
  },

  // Step 9: Publication
  {
    id: "9",
    type: "custom",
    position: { x: 400, y: 960 },
    data: {
      label: "Published Repository",
      description: "Paper goes live",
      icon: BookOpen,
      type: "end",
      width: 240,
    },
  },

  // Step 10: Public Access
  {
    id: "10",
    type: "custom",
    position: { x: 400, y: 1080 },
    data: {
      label: "Browse & Star Papers",
      description: "Public access & favorites",
      icon: Star,
      type: "end",
      width: 240,
    },
  },
];

const initialEdges: Edge[] = [
  // Main Sequential Flow
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "Sign Up",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    label: "Access Dashboard",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#3b82f6", strokeWidth: 3 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    label: "Create New",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#8b5cf6", strokeWidth: 3 },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    label: "Submit for Review",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#8b5cf6", strokeWidth: 3 },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    label: "Review Complete",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#f59e0b", strokeWidth: 3 },
  },
  {
    id: "e6-7",
    source: "6",
    target: "7",
    label: "Approved by Adviser",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#f59e0b", strokeWidth: 3 },
  },
  {
    id: "e7-8",
    source: "7",
    target: "8",
    label: "Review Complete",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#ef4444", strokeWidth: 3 },
  },
  {
    id: "e8-9",
    source: "8",
    target: "9",
    label: "Approved",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#10b981", strokeWidth: 3 },
  },
  {
    id: "e9-10",
    source: "9",
    target: "10",
    label: "Public Access",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#10b981", strokeWidth: 3 },
  },

  // Feedback Loop 1: Adviser Revision
  {
    id: "e6-4",
    source: "6",
    target: "4",
    label: "Needs Revision",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "8 4" },
    type: "smoothstep",
  },

  // Feedback Loop 2: Admin Revision
  {
    id: "e8-5",
    source: "8",
    target: "5",
    label: "Send Back to Adviser",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "8 4" },
    type: "smoothstep",
  },
];

export default function RoadmapPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      {/* Header */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dashboard-header border-0 shadow-xl mb-6">
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

        {/* Legend */}
        <Card className="dashboard-card border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Node Types */}
              <div>
                <h4 className="font-semibold text-sm mb-3 text-muted-foreground">
                  Node Types
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Start Point</div>
                      <div className="text-xs text-muted-foreground">
                        Entry to system
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Process</div>
                      <div className="text-xs text-muted-foreground">
                        Action/Task
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Decision</div>
                      <div className="text-xs text-muted-foreground">
                        Review/Approval
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">End Point</div>
                      <div className="text-xs text-muted-foreground">
                        Final outcome
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Types */}
              <div>
                <h4 className="font-semibold text-sm mb-3 text-muted-foreground">
                  Connection Types
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-10 border-2 border-blue-500 rounded flex items-center justify-center">
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Main Workflow</div>
                      <div className="text-xs text-muted-foreground">
                        Sequential process flow
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-10 border-2 border-red-500 rounded flex items-center justify-center">
                      <div
                        className="w-16 h-1 bg-red-500"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #ef4444 0, #ef4444 8px, transparent 8px, transparent 12px)",
                        }}
                      ></div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Feedback Loop</div>
                      <div className="text-xs text-muted-foreground">
                        Revision & improvement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Chart */}
        <Card className="dashboard-card border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div style={{ height: "1200px", width: "100%" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#94a3b8"
                />
                <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" />
                <MiniMap
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                  maskColor="rgba(0, 0, 0, 0.1)"
                  nodeColor={(node) => {
                    if (node.data.type === "start") return "#3b82f6";
                    if (node.data.type === "process") return "#8b5cf6";
                    if (node.data.type === "decision") return "#f59e0b";
                    if (node.data.type === "end") return "#10b981";
                    return "#e5e7eb";
                  }}
                />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="stat-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Linear Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
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
