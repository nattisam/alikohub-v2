import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardGrid } from "../components/DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useClientDashboardData } from "../queries/dashboard";
import type { ClientDashboardData } from "../components/types";

const ClientDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const isAdmin = currentUser?.globalRole === 'ADMIN' || currentUser?.role === "ADMIN";
  const isClient = currentUser?.role === "CLIENT";

  useEffect(() => {
    // Redirect users who don't have CLIENT or ADMIN permissions away from this page
    if (currentUser && !isClient && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isClient, isAdmin]);
  
  if (!currentUser || (!isClient && !isAdmin)) {
    // Don't render if user doesn't have appropriate permissions
    return null;
  }
  
  const { data: dashboardData, isLoading, isError } = useClientDashboardData();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving Project Status...</p>
      </div>
    );
  }
  
  // Use real data if available, otherwise default empty state
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
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Project Oversight</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium font-serif italic">Operational transparency and consolidated progress for clients</p>
        </div>
        <div className="flex items-center gap-3">
          {isError && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Sync Issue</span>
            </div>
          )}
          <div className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 italic">
            Client: {currentUser?.firstname} {currentUser?.lastname}
          </div>
        </div>
      </div>
      
      <DashboardGrid>
        {/* Project progress */}
        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Consolidated Progress</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-end gap-2">
              <div className="text-5xl font-black text-slate-900 leading-none">{clientData.projectProgress}</div>
              <div className="text-xl font-black text-blue-600 pb-1">%</div>
            </div>
            <div className="mt-6 w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${clientData.projectProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest italic">Live construction metrics</p>
          </CardContent>
        </Card>
        
        {/* Timeline updates */}
        <Card className="md:col-span-2 border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <CardHeader className="border-b border-slate-50 px-8 py-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Latest Project Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 max-h-[350px] overflow-auto">
              {(clientData.recentUpdates || []).length > 0 ? (clientData.recentUpdates || []).map((update) => (
                <div key={update.id} className="px-8 py-6 hover:bg-slate-50 transition-colors flex justify-between items-center group/item text-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-150 transition-transform"></div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{update.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verification System • {update.time}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                    Details
                  </button>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400 text-xs font-medium italic">No recent activities logged from construction sites.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default ClientDashboard;