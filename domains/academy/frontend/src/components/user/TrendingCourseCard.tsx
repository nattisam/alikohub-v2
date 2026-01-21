import { useState } from "react";
import Card from "../../../../../../libraries/ui-libraries/components/Card";
import type { TrendingCourseCardProps } from "../common/types.d";
import { FaStar, FaRegStar, FaStarHalfAlt, FaSpinner } from "react-icons/fa";
import { getCourseImageUrlWithFallback } from "../../utils/imageUtils";

const TrendingCourseCard = ({ course, onEnroll, isEnrolled = false }: TrendingCourseCardProps) => {
  const { title, thumbnail, rating = 0, price = 0 } = course;
  const safeRating = rating ?? 0;
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const fullStars = Array(Math.floor(safeRating))
    .fill(0)
    .map((_, index) => <FaStar key={index} color="gold" />);
  const halfStar =
    safeRating % 1 !== 0 ? [<FaStarHalfAlt key={"half"} color="gold" />] : [];
  const emptyStars = Array(5 - Math.ceil(safeRating))
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
      className="bg-cover w-60 h-40 lg:max-w-[24rem] lg:min-w-[23rem] lg:min-h-[19rem] lg:h-[20rem] lg:max-h-[22rem] rounded-2xl flex flex-col justify-end px-3 py-4"
      style={{ backgroundImage: `url('${getCourseImageUrlWithFallback(thumbnail, course.category)}')` }}
      title={title}
      titleClassName="text-xl text-white font-semibold"
    >
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex text-white gap-1 lg:gap-3 items-center my-2">
          <div className="text-base lg:text-2xl flex flex-row">{allStars}</div>
          <p>${price}</p>
        </div>
        <button
          className={`bg-gradient-to-r from-[#E6D600] to-[#F2F296] px-5 py-1 rounded-4xl font-semibold text-sm ${
            isEnrolling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
          onClick={handleEnroll}
          disabled={isEnrolling}
        >
          {isEnrolling ? (
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Enrolling...
            </div>
          ) : isEnrolled ? "Go to Dashboard" : "Enroll"}
        </button>
      </div>
    </Card>
  );
};

export default TrendingCourseCard;
