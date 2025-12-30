import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentMyCourses from "./StudentMyCourses";
import StudentProgressPage from "./StudentProgressPage";
import StudentCertificates from "./StudentCertificates";

const StudentCourseOverview: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentMyCourses />} />
      <Route path="/progress" element={<StudentProgressPage />} />
      <Route path="/certificates" element={<StudentCertificates />} />
    </Routes>
  );
};

export default StudentCourseOverview;