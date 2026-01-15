import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardGrid } from "../components/DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useClientDashboardData } from "../queries/dashboard";
import BudgetChart from "../components/charts/BudgetChart";
import ProgressBar from "../components/charts/ProgressBar";

const ClientDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect users who don't have CLIENT role away from this page
    if (currentUser && currentUser.contechRole !== "CLIENT") {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.contechRole !== "CLIENT") {
    // Don't render if user doesn't have CLIENT role
    return null;
  }
  
  const { data: dashboardData, isLoading, isError } = useClientDashboardData();
  
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
  const clientData = dashboardData || {
    projectProgress: 65,
    budget: 245000,
    spent: 168500,
    remaining: 76500,
    recentUpdates: [
      { id: 1, title: "Project Phase 2 completed", time: "2 hours ago" },
      { id: 2, title: "New inspection scheduled", time: "1 day ago" },
      { id: 3, title: "Change order approved", time: "2 days ago" },
    ],
    inspectionSummary: {
      passed: 12,
      failed: 3,
      pending: 2,
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Client Dashboard</h2>
        <div className="text-sm text-gray-600">Welcome, {currentUser?.firstname}</div>
      </div>
      
      <DashboardGrid>
        {/* Project progress (%)) */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar percentage={clientData.projectProgress} label="Project Progress" />
          </CardContent>
        </Card>
        
        {/* Timeline summary */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ProgressBar percentage={75} label="Overall Timeline" />
            </div>
          </CardContent>
        </Card>
        
        {/* Budget vs spent */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BudgetChart budget={clientData.budget} spent={clientData.spent} />
            </div>
          </CardContent>
        </Card>
        
        {/* Recent updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(clientData.recentUpdates || []).slice(0, 3).map((update) => (
                <div key={update.id} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">{update.title}</p>
                  <p className="text-xs text-gray-500">{update.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Inspection summary */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Passed</span>
                <span className="font-medium">{clientData.inspectionSummary?.passed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed</span>
                <span className="font-medium text-red-500">{clientData.inspectionSummary?.failed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium">{clientData.inspectionSummary?.pending || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default ClientDashboard;