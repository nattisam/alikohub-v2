import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardGrid } from "../components/DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useContractorDashboardData } from "../queries/dashboard";
import { FaProjectDiagram } from "react-icons/fa";
import type { ContractorDashboardData } from "../components/types";

const ContractorDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const isAdmin = currentUser?.globalRole === 'ADMIN' || currentUser?.role === "PROJECT_MANAGER" || currentUser?.role === "ADMIN";
  const isContractor = currentUser?.role === "CONTRACTOR";

  useEffect(() => {
    // Redirect users who don't have CONTRACTOR or ADMIN permissions away from this page
    if (currentUser && !isContractor && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isContractor, isAdmin]);
  
  if (!currentUser || (!isContractor && !isAdmin)) {
    // Don't render if user doesn't have appropriate permissions
    return null;
  }
  
  const { data: dashboardData, isLoading, isError } = useContractorDashboardData();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Site Data...</p>
      </div>
    );
  }
  
  // Use real data if available, otherwise default empty state
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
  
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Contractor Hub</h2>
          <p className="text-slate-500 text-xs mt-1 font-serif italic">Operational overview for your assigned project scopes</p>
        </div>
        <div className="flex gap-2">
          <div className={`px-5 py-2 ${isError ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'} rounded-2xl border flex items-center gap-2 transition-colors`}>
            <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-600' : 'bg-blue-600 animate-pulse'}`}></span>
            <span className={`text-[10px] font-black ${isError ? 'text-red-700' : 'text-blue-700'} uppercase tracking-widest leading-none`}>
              {isError ? 'Sync Error' : 'Live Sync'}
            </span>
          </div>
        </div>
      </div>
      
      <DashboardGrid>
        {/* Pending tasks */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 group-hover:w-2 transition-all"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-slate-900">{contractorData.pendingTasks}</div>
            <p className="text-[10px] font-bold text-amber-600 mt-2 uppercase tracking-tight flex items-center gap-1">
               Requires Immediate Attention
            </p>
          </CardContent>
        </Card>
        
        {/* Active Scope */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:w-2 transition-all"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Active Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-slate-900">{contractorData.assignedTasks}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Total Assigned Items</p>
          </CardContent>
        </Card>

        {/* Notifications / Communication Summary */}
        <Card className="md:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-slate-900 rounded-[2rem] overflow-hidden p-2 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <FaProjectDiagram size={120} />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Client Communication & Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center hover:bg-white/10 transition-all cursor-pointer group">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tight">Foundation Milestone Approval</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 italic">Client feedback received 2h ago</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-black border border-amber-500/50 group-hover:scale-110 transition-transform">!</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center hover:bg-white/10 transition-all cursor-pointer group">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tight">Site Photo Request: Zone B</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 italic">Admin request for documentation</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-black border border-blue-500/50 group-hover:scale-110 transition-transform">i</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspections Summary (Simplified) */}
        <Card className="md:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden group">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Today's Operating Schedule</CardTitle>
              <span className="text-[10px] font-black text-slate-400 uppercase italic">January 26, 2026</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {(contractorData.todayInspections || []).map((inspection) => (
                <div key={inspection.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all group/item">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-slate-900 group-hover/item:text-blue-600 transition-colors uppercase tracking-tight">{inspection.title}</p>
                    <span className="text-[10px] font-bold text-slate-400 underline decoration-blue-500/30 decoration-2 underline-offset-4 tracking-tighter">{inspection.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span> Site Location: {inspection.location}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default ContractorDashboard;