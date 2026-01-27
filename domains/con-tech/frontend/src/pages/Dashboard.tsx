import { useUser } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHome from "./DashboardHome";

const Dashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect users with specific roles to their appropriate dashboards
    if (currentUser?.role === "CLIENT") {
      navigate("/client");
    } else if (currentUser?.role === "CONTRACTOR") {
      navigate("/contractor");
    } else if (currentUser?.role === "ADMIN") {
      navigate("/admin");
    }
  }, [currentUser, navigate]);
  
  if (currentUser?.role === "CLIENT" || currentUser?.role === "CONTRACTOR") {
    return <DashboardHome />;
  } else if (currentUser?.role === "ADMIN") {
    return (
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
          <p className="text-gray-600">Welcome to the ConTech Admin Dashboard</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800">User Management</h3>
              <p className="text-sm text-gray-600 mt-2">Manage users and permissions</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800">System Settings</h3>
              <p className="text-sm text-gray-600 mt-2">Configure platform settings</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800">Analytics</h3>
              <p className="text-sm text-gray-600 mt-2">View platform analytics</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  // If user hasn't selected a role, return null to let the ProtectedRoute handle it
  return null;
}
export default Dashboard;