
import Card from "../../../../../libraries/ui-libraries/components/Card";
import { FaPlayCircle } from "react-icons/fa";

const CourseIntro = ({
  title,
  thumbnail,
  learningObjectives,
}: {
  title: string;
  thumbnail: string;
  learningObjectives: string[];
}) => {
  return (
    <div className="flex flex-col gap-5 mx-4 my-6 md:grid md:grid-cols-5">
      <Card
        content={title}
        style={{
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="col-span-2 h-[18rem] flex flex-col-reverse justify-center items-center rounded-2xl pb-5"
        contentClassName={"text-2xl text-[#E7D707] px-4 relative -bottom-[30%]"}
      >
        <FaPlayCircle
          size={40}
          className="left-[50%]"
          color="#E6D80D"
        />
      </Card>
      <div className="col-span-3 flex flex-col justify-around items-start">
        <p className="text-lg font-semibold">What you'll learn:</p>
        <ul className="px-10 py-5">
          {learningObjectives.map((objective, index) => (
            <li key={index} className="text-base list-disc">
              {objective}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CourseIntro;
