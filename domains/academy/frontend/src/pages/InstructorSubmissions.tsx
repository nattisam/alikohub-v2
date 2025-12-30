import React from "react";

const InstructorSubmissions: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Submissions</h1>
          <p className="text-gray-500">
            Review and manage course submissions from students.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <div className="text-center py-10 text-gray-500">
          <p>Submissions management will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorSubmissions;