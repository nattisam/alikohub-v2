import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardGrid } from "../components/DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useContractorDashboardData } from "../queries/dashboard";
import ProgressBar from "../components/charts/ProgressBar";

const ContractorDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect users who don't have CONTRACTOR role away from this page
    if (currentUser && currentUser.contechRole !== "CONTRACTOR") {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.contechRole !== "CONTRACTOR") {
    // Don't render if user doesn't have CONTRACTOR role
    return null;
  }
  
  const { data: dashboardData, isLoading, isError } = useContractorDashboardData();
  
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
  const contractorData = dashboardData || {
    assignedTasks: 8,
    overdueTasks: 3,
    pendingTasks: 5,
    todayInspections: [
      { id: 1, title: "Foundation Check", time: "9:00 AM", location: "Site A" },
      { id: 2, title: "Electrical Safety", time: "2:00 PM", location: "Site B" },
    ],
    openIssues: {
      total: 5,
      critical: 2,
      minor: 3,
    },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Contractor Dashboard</h2>
        <div className="text-sm text-gray-600">Welcome, {currentUser?.firstname}</div>
      </div>
      
      <DashboardGrid>
        {/* Assigned tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contractorData.assignedTasks}</div>
            <p className="text-sm text-gray-500">{contractorData.overdueTasks} overdue, {contractorData.pendingTasks} pending</p>
          </CardContent>
        </Card>
        
        {/* Today's inspections */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(contractorData.todayInspections || []).map((inspection) => (
                <div key={inspection.id} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">{inspection.title}</p>
                  <p className="text-xs text-gray-500">{inspection.time} - {inspection.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Open issues */}
        <Card>
          <CardHeader>
            <CardTitle>Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{contractorData.openIssues.total}</div>
            <p className="text-sm text-gray-500">{contractorData.openIssues.critical} critical, {contractorData.openIssues.minor} minor</p>
          </CardContent>
        </Card>
        
        {/* Upload photos / reports */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Photos/Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-center px-4">Drag & drop files or click to upload</p>
            </div>
          </CardContent>
        </Card>
        {/* Productivity chart */}
        <Card>
          <CardHeader>
            <CardTitle>Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ProgressBar percentage={85} label="Weekly Productivity" />
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </div>
  );
};

export default ContractorDashboard;