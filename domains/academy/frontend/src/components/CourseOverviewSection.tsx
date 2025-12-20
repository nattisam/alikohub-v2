import { useState } from "react";
import CourseIntro from "./CourseIntro.tsx";
import CourseMetaInfo from "./CourseMetaInfo.tsx";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import type { Course } from "./types.d.tsx";

const CourseOverviewSection = ({ course }: { course: Course }) => {
  const [folded, setFolded] = useState(true);
  return (
    <section className="flex flex-col p-5 mx-auto">
      <CourseIntro
        title={course.title}
        thumbnail={course?.thumbnail? course.thumbnail : "./assets/cardImage.jpg"}
        learningObjectives={course.conceptsLearned}
      />
      <CourseMetaInfo
        totalEstimatedTime={course?.estimatedTime? course.estimatedTime : 0}
        skills={course?.skills? course.skills : []}
        enrolledStudentsNum={course?.enrolledNum? course.enrolledNum : 0}
        languages={course?.languages? course.languages : ["English"]}
        targetLevel={course?.targetLevel? course.targetLevel : "All Levels"}
      />
      <div className="px-10">
        <h3 className="font-bold text-xl md:text-2xl pt-10 pb-3">
          Description
        </h3>
          {(() => {
            const descriptions: string[] = course.longDescription.split("\n");
            return (
              <>
                {descriptions.map((description, index) => {
                 if(!folded) return <p key={index} className="my-4">{description}</p>;
                 return index < 3 && <p key={index} className="my-4">{description}</p>
                })}
              </>
            );
          })()}
        {!folded && course.prerequisites.length > 0 && (
          <>
            <h3 className="font-bold text-xl md:text-2xl pt-10 pb-3">Prerequisites For the Course</h3>
            <ul className="list-disc pl-5">
              {course.prerequisites.map((prerequisite, index) => (
                <li key={index} className="list-disc pl-5">
                  {prerequisite}
                </li>
              ))}
            </ul>
          </>
        )}
        {
          <button
            className="flex flex-row gap-4 items-center rounded-4xl bg-gradient-to-r from-[#E6D600] to-[#F2F296] hover:shadow-lg drop-shadow-sm drop-shadow-gray-500 px-4 py-1 my-5"
            onClick={() => setFolded(!folded)}
          >
            {folded ? "Show more" : "Show less"}
            {folded ? <FaAngleDown />: <FaAngleUp /> }
          </button>
        }
      </div>
    </section>
  );
};
export default CourseOverviewSection;
