import { useState } from "react";
import type { TrendingCourseCardProps } from "../common/types.d";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { getCourseImageUrlWithFallback } from "../../utils/imageUtils";

const TrendingCourseCard = ({
  course,
  onEnroll,
  isEnrolled = false,
  onViewDetails,
}: TrendingCourseCardProps & { onViewDetails: () => void }) => {
  const { title, thumbnail, rating = 0 } = course;
  const safeRating = rating ?? 0;
  const [isEnrolling, setIsEnrolling] = useState(false);

  const fullStars = Array(Math.floor(safeRating))
    .fill(0)
    .map((_, index) => <FaStar key={index} color="#F0802D" />);
  const halfStar =
    safeRating % 1 !== 0
      ? [<FaStarHalfAlt key={"half"} color="#F0802D" />]
      : [];
  const emptyStars = Array(5 - Math.ceil(safeRating))
    .fill(0)
    .map((_, index) => <FaRegStar key={`e${index}`} color="#F0802D" />);
  const allStars = [...fullStars, ...halfStar, ...emptyStars];

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolling) return;

    setIsEnrolling(true);
    try {
      await onEnroll();
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div
      onClick={onViewDetails}
      className="group relative w-72 lg:w-96 h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url('${getCourseImageUrlWithFallback(thumbnail, course.category)}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="mb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
              {course.category || "General"}
            </span>
            <div className="flex text-xs">{allStars}</div>
          </div>
          <h3 className="text-2xl font-bold text-white leading-tight mb-2 group-hover:text-[#F0802D] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-white/60 text-sm font-medium">
            {course.price && course.price > 0
              ? `$${course.price}`
              : "Free Enrollment"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {isEnrolled ? (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] bg-green-600 text-white"
            >
              Dashboard
            </button>
          ) : null}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingCourseCard;
