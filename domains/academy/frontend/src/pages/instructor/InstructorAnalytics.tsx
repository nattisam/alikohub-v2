import React from "react";

const InstructorAnalytics: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500">
            View detailed analytics and insights for your courses.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <div className="text-center py-10 text-gray-500">
          <p>Analytics dashboard will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;