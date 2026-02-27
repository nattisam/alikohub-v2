import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useContractorDashboardData } from "../queries/dashboard";
import {
  HardHat,
  ClipboardCheck,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type { ContractorDashboardData } from "../components/types";

const ContractorDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const isAdmin =
    currentUser?.globalRole === "ADMIN" || currentUser?.role === "ADMIN";
  const isContractor = currentUser?.role === "CONTRACTOR";

  useEffect(() => {
    if (currentUser && !isContractor && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isContractor, isAdmin]);

  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useContractorDashboardData();

  if (!currentUser || (!isContractor && !isAdmin)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#3E92D1]" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Syncing Site Data...
        </p>
      </div>
    );
  }

  const contractorData: ContractorDashboardData = dashboardData || {
    assignedTasks: 0,
    overdueTasks: 0,
    pendingTasks: 0,
    todayInspections: [],
    openIssues: {
      total: 0,
      critical: 0,
      minor: 0,
    },
  };

  const metrics = [
    {
      label: "Overdue Tasks",
      value: contractorData.overdueTasks,
      icon: AlertCircle,
      color: "bg-red-100",
      iconColor: "text-red-600",
      description: "Immediate action required",
    },
    {
      label: "Pending Tasks",
      value: contractorData.pendingTasks,
      icon: ClipboardCheck,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
      description: "Requires attention",
    },
    {
      label: "Active Pipeline",
      value: contractorData.assignedTasks,
      icon: HardHat,
      color: "bg-blue-100",
      iconColor: "text-[#3E92D1]",
      description: "Total assigned items",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-medium">
            Contractor Hub: Welcome back, {currentUser?.firstName}.
          </h1>
          <p className="text-sm text-gray-500">
            Operational overview for your assigned project scopes
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-[#3E92D1] hover:bg-[#2E82C1] gap-2 text-white shadow-sm transition-colors"
            onClick={() => navigate("/contractor/projects")}
          >
            My Projects
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.label}
              className="border-none shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <Icon className={`w-4 h-4 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <Card className="lg:col-span-2 border-none shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-900">
              Today's Operating Schedule
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(contractorData.todayInspections || []).map((inspection) => (
                <div
                  key={inspection.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:border-[#3E92D1]/20 hover:shadow-sm transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#3E92D1] transition-colors">
                      {inspection.title}
                    </p>
                    <span className="text-[10px] font-bold text-[#3E92D1] bg-[#3E92D1]/5 px-2 py-1 rounded-md">
                      {inspection.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Site: {inspection.location}
                  </p>
                </div>
              ))}
            </div>
            {(!contractorData.todayInspections ||
              contractorData.todayInspections.length === 0) && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400 italic">
                  No inspections scheduled for today.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => navigate("/contractor/projects")}
              className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Site Photos
            </button>
            <button
              onClick={() => navigate("/contractor/projects")}
              className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2"
            >
              <FileText className="w-4 h-4 mr-2" />
              Submit Day Report
            </button>
            <button
              onClick={() => navigate("/contractor/projects")}
              className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Update Project Status
            </button>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="bg-blue-50/50 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#3E92D1] uppercase tracking-wider mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isError ? "bg-red-500" : "bg-emerald-500"}`}
                  ></div>
                  <span className="text-xs font-medium text-gray-600">
                    {isError ? "Sync Error" : "Live Sync Active"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Summary */}
        <Card className="md:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Communication & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="w-10 h-10 rounded-full bg-[#3E92D1]/10 flex items-center justify-center text-[#3E92D1] shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Project-level communication
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Messages and updates are managed per project. Open a project
                  to communicate with clients and post updates.
                </p>
              </div>
              <button
                onClick={() => navigate("/contractor/projects")}
                className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-[#3E92D1] hover:text-[#2E82C1] transition-colors"
              >
                View Projects
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractorDashboard;
