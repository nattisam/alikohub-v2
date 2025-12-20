import { useStudentCourses } from "../hooks/useStudentCourses";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import CourseCard from "./StudentCourseCard";
import type { Course } from "./types.d";

const CoursesList = ({
  courses,
  category,
}: {
  courses: Course[];
  category: string;
}) => {
  const cardWidth = window.innerWidth / 4;
  const { enrollCourse } = useStudentCourses();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  // Ensure courses is an array
  const validCourses = Array.isArray(courses) ? courses : [];

  return (
    <section className="py-4">
      <h2 className="font-semibold md:text-2xl  px-5 my-3">{category}</h2>
      <div className="overflow-x-scroll p-4 mx-4 md:mx-20  flex gap-10">
        {validCourses.length > 0 ? (
          validCourses.map((course) => (
            <CourseCard
              key={course.id}
              className={`rounded-xl overflow-clip min-w-[16rem] md:w-[${cardWidth}] flex flex-col justify-between bg-[#F5F8F3] shadow-md shadow-black`}
              course={course}
              onEnroll={() => {
                if (currentUser) {
                  // Check if user has student role
                  if (currentUser.role === 'STUDENT' || currentUser.globalRole === 'USER') {
                    enrollCourse(course.id);
                  } else {
                    alert("Only students can enroll in courses. Please switch to student role.");
                  }
                } else {
                  // Redirect to login page for unauthenticated users
                  navigate("/auth/login");
                }
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 py-4">No courses available in this category</p>
        )}
      </div>
    </section>
  );
};

export default CoursesList;