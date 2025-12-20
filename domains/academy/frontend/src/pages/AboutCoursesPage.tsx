import Hero from "../../../../general/frontend/src/components/hero.tsx";
import heroBg from "../assets/coursehero1.png";
import InstructorImg from "../assets/image1.png";
import { BsStarHalf } from "react-icons/bs";
import CourseOverviewSection from "../components/CourseOverviewSection.jsx";
import thumbnail from "./../assets/lectureThumbnail.png";
import SimilarCourses from "../components/SimilarCourses.tsx";
import { courses} from "../mock_courses.ts";

import type { Course } from "../components/types.d.jsx";

let sampleCourse = courses[0];
sampleCourse = { ...sampleCourse, thumbnail: thumbnail };
const AboutCoursesPage = ({course=sampleCourse}:{course?:Course}) => {
  return (
    <>
     <Hero
        backgroundImage={heroBg}
        contentClassName="relative z-0 px-6 md:px-32"
        // headingClassName="mt-52 text-4xl text-white font-bold z-20"
        // paragraphClassName="text-lg z-20 leading-tight text-white max-w-[500px] mt-4"
        buttonClassName="mt-6 gap-x-4 rounded-3xl font-semibold z-20 w-72"
        // cardWrapperClassName="bg-gradient-to-r from-[#000000] to-white"
        imageWrapperClassName="rounded-xl shadow-xl"
        heading="Certified Nursing assistant (CNA)"
        subheading="Lorem ipsum dolor sit amet consectetur. Elit aenean pharetra vulputate morbi. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci."
        buttonOneText="Try for free"
        buttonTwoText="Enroll now"
        showButtons={true}
        // buttonClassName="text-[#E6D600]"
        customContent={
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000]  to-[#000000]/0 z-10 pointer-events-none" />

            <div className="relative z-20 flex flex-col gap-4 mt-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={InstructorImg}
                  alt="Instructor Dr. Eden Alemayehu"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="flex items-center gap-2 text-xs">
                  <span className="opacity-70">Instructor:</span>
                  <strong className="text-sm">{`${course.instructor.firstname} ${course.instructor.lastname}`}</strong>
                </div>
              </div>

              <div className="flex gap-10  text-xs">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <BsStarHalf className="text-yellow-400 w-4 h-4" />
                    <span className="text-lg font-semibold">{course.rating}</span>
                  </div>
                  <span className="opacity-70">Average Rating</span>
                </div>
                <div className="flex flex-col ">
                  <span className="text-lg font-semibold">{course.enrolledNum}</span>
                  <span className="opacity-70">Students Enrolled</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{course.estimatedTime}</span>
                  <span className="opacity-70 justify-start">
                    Hours of Content
                  </span>
                </div>
              </div>
            </div>
          </>
        }
      />
      <CourseOverviewSection course={sampleCourse} />
      <SimilarCourses course={course} />
    </>
  );
};

export default AboutCoursesPage;
