import React from "react";
import Navbar from "@/components/Navbar";

const InstructorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="font-semibold mb-2">My Courses</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="font-semibold mb-2">Total Students</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="font-semibold mb-2">Total Earnings</h3>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
