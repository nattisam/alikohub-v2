import type { HTMLAttributes } from "react";
import { useState } from "react";
import Card from "../../../../../../libraries/ui-libraries/components/Card";
import { FaStar, FaRegStar, FaStarHalfAlt, FaSpinner } from "react-icons/fa";
import type { Course } from "../common/types.d";
import { getCourseImageUrlWithFallback } from "../../utils/imageUtils";
export default function CourseCard({
  course,
  onEnroll,
  isEnrolled = false,
  className,
}: {
  course: Course ;
  className?: HTMLAttributes<string>["className"];
  onEnroll: () => void;
  isEnrolled?: boolean;
}) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  course.rating = course.rating ?? 0;
    const fullStars = Array(Math.floor(course.rating))
    .fill(0)
    .map((_, index) => <FaStar key={index} color="gold" />);
  const halfStar =
    course.rating % 1 !== 0 ? [<FaStarHalfAlt key={"half"} color="gold" />] : [];
  const emptyStars = Array(5 - Math.ceil(course.rating))
    .fill(0)
    .map((_, index) => <FaRegStar key={`e${index}`} color="gold" />);
  const allStars = [...fullStars, ...halfStar, ...emptyStars];

  const handleEnroll = async () => {
    if (isEnrolling) return;
    
    setIsEnrolling(true);
    try {
      await onEnroll();
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Card
      className={
        className
          ? className
          : "rounded-xl overflow-clip flex flex-col bg-[#F5F8F3] shadow-md shadow-black"
      }
      img={getCourseImageUrlWithFallback(course.thumbnail, course.category)}
      imgClassName={"rounded-t w-full h-[10rem]"}
      title={course.title}
      titleClassName={"px-3 my-1 font-semibold font-sans text-base"}
      content={course.shortDescription}
      contentClassName={"px-4 mb-2 text-sm leading-snug text-gray-500"}
      actions={[
        {
          label: isEnrolling ? (
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Enrolling...
            </div>
          ) : isEnrolled ? "Go to Dashboard" : "Enroll",
          onClick: handleEnroll,
          className: `rounded-3xl bg-gradient-to-r from-[#E6D600] to-[#F2F296] shadow-md shadow-gray-500 ml-4 mb-4 px-4 w-fit ${
            isEnrolling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
          }`,
        },
      ]}
    >
      <div className="flex justify-between flex-row px-3">
        {course.rating && (
          <div id="rating" className="flex flex-row gap-0.5 items-center">
            {allStars}
            {course.rating}
          </div>
        )}
        <p>{`$${course?.price}`}</p>
      </div>
    </Card>
  );
}
