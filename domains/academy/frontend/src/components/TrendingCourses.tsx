import TrendingCourseCard from "./TrendingCourseCard";
import type { Course } from "./types.d";
import { useNavigate } from "react-router-dom";

type TrendingCoursesProps = {
  courses: Course[];
  onEnroll?: (courseId: number) => void;
};

const TrendingCourses = ({ courses, onEnroll }: TrendingCoursesProps) => {
  const navigate = useNavigate();
  const validCourses = Array.isArray(courses) ? courses : [];

  const handleEnroll = (courseId: number) => {
    // UI-only behavior
    if (onEnroll) {
      onEnroll(courseId);
    } else {
      navigate("/courses");
    }
  };

  return (
    <section>
      <h2 className="text-center text-2xl lg:text-4xl font-extrabold mt-4">
        Trending Now
      </h2>

      <p className="text-center my-5 text-gray-400 w-[90%] md:w-[50%] mx-auto text-sm">
        AlikoHub is building Africa's digital future—uniting education,
        consultancy, and smart tools under one platform.
      </p>

      <div className="overflow-x-scroll mx-4 md:mx-20 flex gap-4">
        {validCourses.length ? (
          validCourses.map((course) => (
            <TrendingCourseCard
              key={course.id}
              course={course}
              onEnroll={() => handleEnroll(course.id)}
            />
          ))
        ) : (
          <p className="text-center w-full py-4 text-gray-500">
            No trending courses available
          </p>
        )}
      </div>
    </section>
  );
};

export default TrendingCourses;
