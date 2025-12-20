import TrendingCourseCard from "./TrendingCourseCard";
import type { Course } from "./types.d";
import { useStudentCourses } from "../hooks/useStudentCourses";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const TrendingCourses = ({ courses }: { courses: Course[] }) => {
  const { enrollCourse } = useStudentCourses();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  // Ensure courses is an array
  const validCourses = Array.isArray(courses) ? courses : [];

  const handleEnroll = (courseId: number) => {
    if (currentUser) {
      // Check if user has student role
      if (currentUser.role === 'STUDENT' || currentUser.globalRole === 'USER') {
        enrollCourse(courseId);
      } else {
        alert("Only students can enroll in courses. Please switch to student role.");
      }
    } else {
      // Redirect to login page for unauthenticated users
      navigate("/auth/login");
    }
  };

  return (
    <section className="">
      <h2 className="text-center text-2xl lg:text-4xl font-extrabold mt-4">
        Trending Now
      </h2>
      <p className="text-center my-5 text-gray-400 w-[90%] md:w-[50%] mx-auto text-sm ">
        AlikoHub is building Africa's digital future—uniting education, global
        consultancy, and smart construction tools under one seamless platform.
      </p>
      <div className="overflow-x-scroll mx-4 px-1 md:py-4 md:mx-20 flex gap-2 md:gap-10">
        {validCourses.length > 0 ? (
          validCourses.map((course) => (
            <TrendingCourseCard
              key={course.id}
              course={course}
              onEnroll={() => handleEnroll(course.id)}
            />
          ))
        ) : (
          <p className="text-center w-full py-4 text-gray-500">No trending courses available</p>
        )}
      </div>
    </section>
  );
};

export default TrendingCourses;