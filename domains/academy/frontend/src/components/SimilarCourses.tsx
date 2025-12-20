import Card from "../../../../../libraries/ui-libraries/components/Card";
import { useContext, useEffect, useState } from "react";

import type { Course } from "./types.d";
import { StudentCourseContext } from "../contexts/StudentCoursesContext";
const SimilarCourses = ({ course }: { course: Course }) => {
  /**
   * fetch similar courses from the backend. similar courses filtered by category and course title and skills the course provides
   */
  // const [loading, setLoading] = useState(false);
  // const [fetchingError, setFetchingError] = useState(false);
  /*
   method to fetch similar courses from backend if the end point is available

  async function getCourses(courseId: number) {
    try {
      setLoading(true);  
      
    } catch (er) {
      console.error(er);
      setFetchingError(true);
      return [];
    } finally {
      setLoading(false);
    }
  }*/
  const { getSimilarCourses } = useContext(StudentCourseContext)!;
  const [courses, setCourses] = useState<Course[]>(getSimilarCourses(course));
  useEffect(() => {
    if (course) {
      const fetchCourses = async () => {
        try {
          setCourses([]);
          setCourses(getSimilarCourses(course));
        } catch (error) {
          console.error(error);
        }
      };
      fetchCourses();
    }
  }, [course, getSimilarCourses]);
  return (
    <section>
      <h2>Similar Courses</h2>
      {/* <div className="overflow-x-auto flex fle-row gap-5 my-5 mx-10">
        {loading && <></>}
        {!loading && fetchingError && ( */}
      {!courses && (
        <div className="text-center text-gray-500">
          No similar courses found
        </div>
      )}
      {/* {!loading &&
          !fetchingError &&
          courses && */}
      {courses.map((course: Course) => (
        <Card title={course.title} key={course.id} />
      ))}
      {/* </div> */}
    </section>
  );
};
export default SimilarCourses;
