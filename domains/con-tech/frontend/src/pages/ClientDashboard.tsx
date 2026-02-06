import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useClientDashboardData } from "../queries/dashboard";
import {
  TrendingUp,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  Activity,
  FileText,
  ShieldCheck,
  Loader2,
  Calendar,
} from "lucide-react";
import type { ClientDashboardData } from "../components/types";

const ClientDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const isAdmin =
    currentUser?.globalRole === "ADMIN" || currentUser?.role === "ADMIN";
  const isClient = currentUser?.role === "CLIENT";

  useEffect(() => {
    if (currentUser && !isClient && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isClient, isAdmin]);

  const { data: dashboardData, isLoading, isError } = useClientDashboardData();

  if (!currentUser || (!isClient && !isAdmin)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#3E92D1]" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Retrieving Project Status...
        </p>
      </div>
    );
  }

  const clientData: ClientDashboardData = dashboardData || {
    projectProgress: 0,
    budget: 0,
    spent: 0,
    remaining: 0,
    recentUpdates: [],
    inspectionSummary: {
      passed: 0,
      failed: 0,
      pending: 0,
    },
  };

  const metrics = [
    {
      label: "Overall Progress",
      value: `${clientData.projectProgress}%`,
      icon: TrendingUp,
      color: "bg-blue-100",
      iconColor: "text-[#3E92D1]",
      description: "Construction completion",
    },
    {
      label: "Budget Utilization",
      value: `$${clientData.spent.toLocaleString()}`,
      icon: Wallet,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
      description: `of $${clientData.budget.toLocaleString()}`,
    },
    {
      label: "Inspection Status",
      value: clientData.inspectionSummary?.passed || 0,
      icon: ShieldCheck,
      color: "bg-emerald-100",
      iconColor: "text-emerald-600",
      description: `${clientData.inspectionSummary?.pending || 0} pending review`,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-medium">
            Project Oversight: Welcome, {currentUser?.firstName}.
          </h1>
          <p className="text-sm text-gray-500">
            Real-time transparency and progress tracking
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-[#3E92D1] hover:bg-[#2E82C1] gap-2 text-white shadow-sm transition-colors"
            onClick={() => navigate("/client/projects")}
          >
            Project Portfolio
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
        {/* Progress & Activities */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900">
              Latest Project Activity
            </CardTitle>
            <Activity className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50 max-h-[400px] overflow-auto">
              {(clientData.recentUpdates || []).length > 0 ? (
                (clientData.recentUpdates || []).map((update) => (
                  <div
                    key={update.id}
                    className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#3E92D1]">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-[#3E92D1] transition-colors">
                          {update.title}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {update.time}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 text-sm italic">
                  No recent activities logged from construction sites.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quality & Budget Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
                    Passed
                  </span>
                  <span className="text-xl font-bold text-emerald-600">
                    {clientData.inspectionSummary?.passed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Pending
                  </span>
                  <span className="text-xl font-bold text-amber-600">
                    {clientData.inspectionSummary?.pending || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-xs font-medium text-red-800 uppercase tracking-wider">
                    Failed
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {clientData.inspectionSummary?.failed || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Quick Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Download Budget Report
              </button>
              <button className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Detailed Timeline
              </button>

              <div className="pt-4 mt-4 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                  System Status
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isError ? "bg-red-500" : "bg-emerald-500"}`}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {isError ? "Sync Offline" : "Global Sync Active"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
