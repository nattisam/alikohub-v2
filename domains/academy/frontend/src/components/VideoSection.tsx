import { Clock, PlayCircle, FileBadge2 } from "lucide-react";
type ButtonProps = {
  label: string;
  className : string;
  onClick?: () => void;
};

const Button = ({ label, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E6D600] to-[#F2F296] hover:bg-yellow-500 text-black font-medium rounded-full shadow-md transition ${className}`}
    >
      {/* Play Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="black"
        className="w-5 h-5"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      {label}
    </button>
  );
};


interface CourseCardProps {
  title: string;
  description: string;
  hours: string;
  videos: number;
  certificate: boolean;
  progress: number; // percentage
}

const CourseCard = ({
  title,
  description,
  hours,
  videos,
  certificate,
  progress,
}:CourseCardProps ) => {
  return (
    <div className="bg-white border-gray-100  border-[1px] rounded-lg p-4 flex flex-col gap-2 relative">
      {/* Title */}
      <h2 className="text-gray-900 font-semibold text-lg">{title}</h2>

      {/* Description */}
      <p className="text-gray-400 font-medium text-sm">{description}</p>

      {/* Info Row */}
      <div className="flex items-center gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{hours}</span>
        </div>
        <div className="flex items-center gap-1">
          <PlayCircle className="w-4 h-4" />
          <span>{videos} videos</span>
        </div>
        {certificate && (
          <div className="flex items-center gap-1">
            <FileBadge2 className="w-4 h-4" />
            <span>Certificate Included</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="h-1.5 bg-gray-200 rounded-full">
          <div
            className="h-1.5 bg-yellow-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Label */}
      <div className="absolute top-2 px-2 py-1/2 right-3 text-xs rounded-4xl bg-gray-100 text-gray-500">
        {progress}% Complete
      </div>
    </div>
  );
};


const VideoCard = () => {
  return (
    <div className="w-4xl border-gray-100 mb-4 bg-[#F5F8F2] ml-0 overflow-hidden">
        <CourseCard
          title="AWS Solutions Architect Professional"
          description="Master the AWS Cloud and become a Solutions Architect."
          hours="40 hours"
          videos={20}
          certificate={true}
          progress={75}
        />
      {/* Video Placeholder */}
      <div className="relative w-full">
         <iframe
            className="w-full h-96 mt-3 border-8"
            src = "https://www.youtube.com/embed/lkIFF4maKMU?si=E82jOTriJ6LOlE2L"
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          >
      </iframe>
      </div>

      {/* Text Below */}
      <div className="px-4 py-3 bg-white rounded-lg pb-4">
      <p className=" text-black font-medium text-md pb-2">
        Advanced VPC Configuration</p>         
        <p className="text-gray-600 pb-2">Tempus lectus sociis aliquet libero nisl augue. Tellus eget dolor
        adipiscing sit lectus justo et.
      </p>
      <Button className ="mt-4"  label="Continue Watching" onClick={() => console.log("Button clicked")} />
      </div>
    </div>
  );
};

export default VideoCard;
