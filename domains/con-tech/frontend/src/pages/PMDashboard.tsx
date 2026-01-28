import { useUser } from "../hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardGrid } from "../components/DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { contechAPI } from "../services/api";
import BarChart from "../components/charts/BarChart";

const PMDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    activeProjects: 0,
    contractors: 0,
    clients: 0,
    projectStatus: {
      active: 0,
      pending: 0,
      completed: 0,
    }
  });

  const isAdmin = currentUser?.globalRole === 'ADMIN' || currentUser?.role === "ADMIN";
  
  useEffect(() => {
    if (currentUser && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate, isAdmin]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [clientResponse, contractorResponse, projectResponse] = await Promise.all([
          contechAPI.getUsersByRole('CLIENT', 1, 100),
          contechAPI.getUsersByRole('CONTRACTOR', 1, 100),
          contechAPI.getAllProjects(1, 100)
        ]);

        const clients = clientResponse?.total || 0;
        const contractors = contractorResponse?.total || 0;
        const projects = projectResponse?.total || 0;
        
        // Calculate project status distribution
        const projectStatus = {
          active: 0,
          pending: 0,
          completed: 0,
        };

        if (projectResponse?.items) {
          projectResponse.items.forEach((project: any) => {
            switch (project.status?.toLowerCase()) {
              case 'active':
              case 'in_progress':
                projectStatus.active++;
                break;
              case 'pending':
              case 'on_hold':
                projectStatus.pending++;
                break;
              case 'completed':
              case 'finished':
                projectStatus.completed++;
                break;
            }
          });
        }

        setDashboardData({
          totalProjects: projects,
          activeProjects: projectStatus.active,
          contractors,
          clients,
          projectStatus
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  if (!currentUser || !isAdmin) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Compiling Analytics...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium font-serif italic">System-wide overview for Aliko Construction</p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
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
            <div className="text-4xl font-black text-slate-900">{dashboardData.totalProjects}</div>
            <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-tight">System Global</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{dashboardData.activeProjects}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Currently In Progress</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{dashboardData.contractors}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Active Team Members</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">{dashboardData.clients}</div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Registered Partners</p>
          </CardContent>
        </Card>

        {/* Project Status Breakdown */}
        <Card className="md:col-span-2 border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl">
                    {dashboardData.projectStatus.active}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">Active Projects</p>
                    <p className="text-[10px] text-slate-500 italic">Currently in progress</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600">
                    {dashboardData.totalProjects > 0 
                      ? Math.round((dashboardData.projectStatus.active / dashboardData.totalProjects) * 100)
                      : 0}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-xl">
                    {dashboardData.projectStatus.pending}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">Pending Projects</p>
                    <p className="text-[10px] text-slate-500 italic">On hold or awaiting start</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-amber-600">
                    {dashboardData.totalProjects > 0 
                      ? Math.round((dashboardData.projectStatus.pending / dashboardData.totalProjects) * 100)
                      : 0}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xl">
                    {dashboardData.projectStatus.completed}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">Completed Projects</p>
                    <p className="text-[10px] text-slate-500 italic">Successfully finished</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-600">
                    {dashboardData.totalProjects > 0 
                      ? Math.round((dashboardData.projectStatus.completed / dashboardData.totalProjects) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions for Admin */}
        <Card className="border-none shadow-lg shadow-slate-200/50 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden p-2 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/projects/new')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 hover:border-white/40 transition-all group/btn flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-lg">➕</div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Create New Project</p>
                    <p className="text-[10px] text-white/70 italic">Initialize project scope</p>
                  </div>
                </div>
                <span className="text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all">→</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 hover:border-white/40 transition-all group/btn flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-lg">👥</div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Manage Users</p>
                    <p className="text-[10px] text-white/70 italic">Create & assign contractors/clients</p>
                  </div>
                </div>
                <span className="text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all">→</span>
              </button>

              <button 
                onClick={() => navigate('/admin/reports')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 hover:border-white/40 transition-all group/btn flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-lg">📊</div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">System Reports</p>
                    <p className="text-[10px] text-white/70 italic">Analytics & insights</p>
                  </div>
                </div>
                <span className="text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all">→</span>
              </button>
            </div>
          </CardContent>
        </Card>
        
        {/* Project Velocity Chart */}
        <Card className="md:col-span-3 border-none shadow-lg shadow-slate-200/50 bg-white rounded-3xl overflow-hidden p-2">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">System Monitoring & Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <BarChart 
                data={[
                  { month: 'Jan', progress: 20 }, 
                  { month: 'Feb', progress: 35 }, 
                  { month: 'Mar', progress: 45 }, 
                  { month: 'Apr', progress: 60 }
                ]}
                xKey="month"
                yKey="progress"
                title="Consolidated Project Progress"
              />
            </div>
          </CardContent>
        </Card>
    
      </DashboardGrid>
    </div>
  );
};

export default PMDashboard;