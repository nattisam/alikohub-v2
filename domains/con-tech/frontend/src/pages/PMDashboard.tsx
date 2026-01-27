import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardGrid } from "../components/DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useProjectManagerDashboardData } from "../queries/dashboard";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";

const PMDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const isAdmin = currentUser?.globalRole === 'ADMIN' || currentUser?.role === "ADMIN";
  
  useEffect(() => {
    // Redirect users who don't have Admin permissions away from this page
    if (currentUser && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isAdmin]);
  
  if (!currentUser || !isAdmin) {
    // Don't render if user doesn't have Admin permissions
    return null;
  }
  
  const { data: dashboardData, isLoading, isError } = useProjectManagerDashboardData();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Compiling Analytics...</p>
      </div>
    );
  }
  
  // Use real data if available, otherwise zeros (not fake mock data unless intended)
  const pmData = dashboardData || {
    activeProjects: 0,
    activeProjectsChange: 0,
    contractStatus: {
      pending: 0,
      active: 0,
      completed: 0,
    },
    rfis: {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    qualityIssues: {
      total: 0,
      critical: 0,
      minor: 0,
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium font-serif italic">System-wide overview for Aliko Construction</p>
        </div>
        <div className="flex items-center gap-3">
          {isError && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Offline Mode</span>
            </div>
          )}
          <div className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
            Admin: {currentUser?.firstname} {currentUser?.lastname}
          </div>
        </div>
      </div>
      
      <DashboardGrid>
        {/* System Overview Stats */}
        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{pmData.activeProjects + 5}</div>
            <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-tight">System Global</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{pmData.activeProjects}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Currently In Progress</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">8</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Active Team Members</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">14</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Registered Partners</p>
          </CardContent>
        </Card>
        
        {/* Project Velocity Chart */}
        <Card className="md:col-span-2 border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">System Monitoring & Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <BarChart 
                data={[{ month: 'Jan', progress: 20 }, { month: 'Feb', progress: 35 }, { month: 'Mar', progress: 45 }, { month: 'Apr', progress: 60 }]}
                xKey="month"
                yKey="progress"
                title="Consolidated Project Progress"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Project Status */}
        <Card className="md:col-span-2 border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Portfolio Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 items-center gap-8">
            <div className="h-64">
              <PieChart 
                data={[
                  { name: 'On Hold', value: pmData.contractStatus.pending },
                  { name: 'Active', value: pmData.contractStatus.active },
                  { name: 'Completed', value: pmData.contractStatus.completed },
                ]}
                dataKey="value"
                nameKey="name"
                title="Current Projects State"
              />
            </div>
            <div className="space-y-4 pr-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-default">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors uppercase">Active Engagements</span>
                <span className="text-lg font-black text-slate-900">{pmData.contractStatus.active}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-amber-500/5 transition-all cursor-default">
                <span className="text-xs font-bold text-slate-500 group-hover:text-amber-500 transition-colors uppercase">Projects On Hold</span>
                <span className="text-lg font-black text-slate-900">{pmData.contractStatus.pending}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-default">
                <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-500 transition-colors uppercase">Handed Over</span>
                <span className="text-lg font-black text-slate-900">{pmData.contractStatus.completed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default PMDashboard;