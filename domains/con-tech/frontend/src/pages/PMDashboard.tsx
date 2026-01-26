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
  
  const isAdmin = currentUser?.globalRole === 'ADMIN' || currentUser?.role === "PROJECT_MANAGER" || currentUser?.role === "ADMIN";
  
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
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-red-600">Error loading dashboard data</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }
  
  // Use mock data if no actual data is available
  const pmData = dashboardData || {
    activeProjects: 12,
    activeProjectsChange: 2,
    contractStatus: {
      pending: 3,
      active: 8,
      completed: 1,
    },
    rfis: {
      pending: 5,
      approved: 3,
      rejected: 1,
    },
    qualityIssues: {
      total: 7,
      critical: 2,
      minor: 5,
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Project Manager Dashboard</h2>
        <div className="text-sm text-gray-600">Welcome, {currentUser?.firstname}</div>
      </div>
      
      <DashboardGrid>
        {/* Active projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pmData.activeProjects}</div>
            <p className="text-sm text-gray-500">+{pmData.activeProjectsChange} from last week</p>
          </CardContent>
        </Card>
        
        {/* Gantt chart */}
        <Card>
          <CardHeader>
            <CardTitle>Gantt Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart 
                data={[{ month: 'Jan', progress: 20 }, { month: 'Feb', progress: 30 }, { month: 'Mar', progress: 45 }]}
                xKey="month"
                yKey="progress"
                title="Project Progress Over Time"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Contract status */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PieChart 
                data={[
                  { name: 'Pending', value: pmData.contractStatus.pending },
                  { name: 'Active', value: pmData.contractStatus.active },
                  { name: 'Completed', value: pmData.contractStatus.completed },
                ]}
                dataKey="value"
                nameKey="name"
                title="Contract Status Distribution"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* RFIs & change orders */}
        <Card>
          <CardHeader>
            <CardTitle>RFIs & Change Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium">{pmData.rfis.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Approved</span>
                <span className="font-medium">{pmData.rfis.approved}</span>
              </div>
              <div className="flex justify-between">
                <span>Rejected</span>
                <span className="font-medium">{pmData.rfis.rejected}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quality issues */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{pmData.qualityIssues.total}</div>
            <p className="text-sm text-gray-500">{pmData.qualityIssues.critical} critical, {pmData.qualityIssues.minor} minor</p>
          </CardContent>
        </Card>
        
        {/* Team productivity */}
        <Card>
          <CardHeader>
            <CardTitle>Team Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart 
                data={[{ team: 'Design', productivity: 85 }, { team: 'Construction', productivity: 78 }, { team: 'QA', productivity: 92 }]}
                xKey="team"
                yKey="productivity"
                title="Team Productivity Metrics"
              />
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default PMDashboard;