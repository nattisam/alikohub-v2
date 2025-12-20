import { BsGraphUp } from "react-icons/bs";
import { FaGlobe, FaGraduationCap } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdTimer } from "react-icons/md";

const CourseMetaInfo = ({
  totalEstimatedTime,
  skills,
  enrolledStudentsNum,
  languages,
  targetLevel,
}: {
  totalEstimatedTime: number;
  skills: string[];
  targetLevel:string;
  enrolledStudentsNum: number;
  languages: string[];
}) => {
  return (
    <div className="min-w-full grid grid-cols-2 grid-rows-3 gap-y-2 md:flex">
      <div className="flex flex-col items-center justify-around text-center p-4 rounded-l-2xl bg-[#F3F3F3] w-full" >
        <h3 className="text-gray-500 text-base flex flex-row gap-5 items-center justify-around w-fit">
            <MdTimer size={20} />Estimated Effort</h3>
        <p>{totalEstimatedTime} Hours</p>
      </div>
      <div className="flex flex-col items-center justify-around text-center rounded-r-2xl md:rounded-none p-4 bg-[#F3F3F3] w-full" >
        <h3 className="text-gray-500 text-sm flex flex-row gap-5 items-center justify-around w-fit">
            <FaGraduationCap  size={20} />Level</h3>
        <p>{targetLevel}</p>
      </div>
      <div className="flex flex-col items-center justify-around text-center p-4 rounded-2xl md:rounded-none bg-[#F3F3F3] w-full row-start-3 col-span-2 md:max-w-[25rem] md:min-w-[22rem]">
        <h3 className="text-gray-500 text-base flex flex-row gap-5 items-center justify-around w-fit">
            <BsGraphUp size={20} />Skills You Will Learn</h3>
        <p className="text-sm py-2">{skills.join(", ")}</p>
      </div>
      <div className="flex flex-col items-center justify-around text-center p-4 rounded-l-2xl md:rounded-none bg-[#F3F3F3] w-full">
        <h3 className="text-gray-500 text-base flex flex-row gap-5 items-center justify-around w-fit">
            <FaPeopleGroup size={20} />People Over</h3>
        <p>{enrolledStudentsNum < 10 ? enrolledStudentsNum : `${Math.floor(enrolledStudentsNum / 10) * 10}+`}</p>
      </div>
      <div className="flex flex-col items-center justify-around text-center p-4 rounded-r-2xl bg-[#F3F3F3] w-full">
        <h3 className="text-gray-500 text-sm flex flex-row gap-4 items-center justify-around w-fit">
            <FaGlobe size={20} />Language</h3>
        <p>{languages.join(", ")}</p>
      </div>
    </div>
  );
};

export default CourseMetaInfo;
