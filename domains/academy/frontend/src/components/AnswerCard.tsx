import { useEffect, useState } from "react";
import InQandAProfile from "./InQandAProfile";
import type {Answer } from "./types.d"

const AnswerCard = ({ answeredBy, answerText }: Answer) => {
  const [answeredByDetail, setAnsweredByDetail] = useState<{
    id: string | number;
    name: string;
    imgUrl: string;
    qualification?: string;
  } | null>(null);
  const [readMore, setReadMore] = useState(false);
  useEffect(() => {
    const fetchAskerDetail = async (answeredBy: string| number) => {
      console.log(`fetching data about ${answeredBy}`);
      setAnsweredByDetail({
        id: "1",
        name: "Alex Johnson",
        imgUrl: `https://avatar.iran.liara.run/public/alex_johnson`,
        qualification: "Cloud Architect",
      });
    };
    fetchAskerDetail(answeredBy);
  }, [answeredBy]);

  return (
    <div>
      {answeredByDetail && <InQandAProfile {...answeredByDetail} />}
      <p className="text-gray-500 h-fit">
        {answerText.length > 100 && !readMore
          ? `${answerText.slice(0, 100)}...`
          : answerText}
      </p>
      {answerText.length > 100 && (
        <button 
          className="bg-none border-none hover:text-gray-200 text-gray-500"
        onClick={() => setReadMore(!readMore)}>
          Read {readMore ? "Less" : "More"}
        </button>
      )}
    </div>
  );
};

export default AnswerCard;