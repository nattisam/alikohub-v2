import React from "react";

const InstructorCreateCourse: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-gray-500">
            Create and set up a new course for your students.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <div className="text-center py-10 text-gray-500">
          <p>Create Course form will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorCreateCourse;