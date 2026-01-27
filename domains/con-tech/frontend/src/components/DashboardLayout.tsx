import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../hooks";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function DashboardLayout() {
  const { currentUser, isLoading } = useUser();
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-row min-h-[calc(100vh-120px)]">
        {showSidebar && <Sidebar />}
        <main className={`${showSidebar ? "ml-0 md:ml-16" : ""} flex-1 p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default DashboardLayout;