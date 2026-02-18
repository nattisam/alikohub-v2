import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useProjectManagerDashboardData } from "../queries/dashboard";
import ServerError from "../components/common/ServerError";
import BarChart from "../components/charts/BarChart";
import {
  Briefcase,
  HardHat,
  Users,
  Building2,
  ArrowUpRight,
  ChevronRight,
  Activity,
  ClipboardList,
  BarChart3,
  Loader2,
} from "lucide-react";

const PMDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading: loading,
    error,
    refetch,
  } = useProjectManagerDashboardData();

  const isAdmin =
    currentUser?.globalRole === "ADMIN" || currentUser?.role === "ADMIN";

  useEffect(() => {
    if (currentUser && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isAdmin]);

  if (!currentUser || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#3E92D1]" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading Analytics...
        </p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return <ServerError onRetry={() => refetch()} />;
  }

  const metrics = [
    {
      label: "Total Projects",
      value: dashboardData.projectStats.total,
      icon: Briefcase,
      color: "bg-blue-100",
      iconColor: "text-[#3E92D1]",
      description: "System-wide construction",
    },
    {
      label: "Active Projects",
      value: dashboardData.projectStats.active,
      icon: HardHat,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      description: "Currently in progress",
    },
    {
      label: "Contractors",
      value: dashboardData.users.contractors,
      icon: Users,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
      description: "Active team members",
    },
    {
      label: "Clients",
      value: dashboardData.users.clients,
      icon: Building2,
      color: "bg-emerald-100",
      iconColor: "text-emerald-600",
      description: "Registered partners",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-medium">
            Welcome back, {currentUser?.firstName}. Here's the construction
            platform status.
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#3E92D1] hover:bg-[#2E82C1] gap-2 text-white shadow-sm"
            onClick={() => navigate("/admin/projects")}
          >
            Manage Projects
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {/* Project Status Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Project Portfolio Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                onClick={() => navigate("/admin/projects")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {dashboardData.projectStats.active}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Active Projects in Progress
                    </p>
                    <p className="text-xs text-gray-500">
                      {dashboardData.projectStats.total > 0
                        ? Math.round(
                            (dashboardData.projectStats.active /
                              dashboardData.projectStats.total) *
                              100,
                          )
                        : 0}
                      % of your current pipeline
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>

              <div
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                onClick={() => navigate("/admin/projects")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm">
                    {dashboardData.projectStats.planned}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Planned & Starting Initiatives
                    </p>
                    <p className="text-xs text-gray-500">
                      Awaiting initialization or starting soon
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>

              <div
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                onClick={() => navigate("/admin/projects")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#3E92D1] font-bold text-sm">
                    {dashboardData.projectStats.completed}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Successfully Completed Projects
                    </p>
                    <p className="text-xs text-gray-500">
                      Finalized and archived deliverables
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tasks */}
        <Card className="border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2"
              onClick={() => navigate("/admin/projects/new")}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Create New Project
            </button>
            <button
              className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage System Users
            </button>
            <button
              className="w-full inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors border border-gray-200 hover:border-[#3E92D1] hover:text-[#3E92D1] bg-white h-10 px-4 py-2"
              onClick={() => navigate("/admin/reports")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate System Reports
            </button>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="bg-blue-50/50 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#3E92D1] uppercase tracking-wider mb-1">
                  System Health
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-emerald-500"}`}
                  ></div>
                  <span className="text-xs font-medium text-gray-600">
                    {error ? "Limited Connectivity" : "Systems Operational"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              Project Status Breakdown
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Distribution of projects by current status
            </p>
          </div>
          <Activity className="w-5 h-5 text-gray-300" />
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <BarChart
              data={[
                { status: "Active", count: dashboardData.projectStats.active },
                {
                  status: "Planned",
                  count: dashboardData.projectStats.planned,
                },
                {
                  status: "Completed",
                  count: dashboardData.projectStats.completed,
                },
                { status: "Total", count: dashboardData.projectStats.total },
              ]}
              xKey="status"
              yKey="count"
              title=""
              color="#3E92D1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMDashboard;
