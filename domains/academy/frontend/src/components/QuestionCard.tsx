import { useEffect, useState } from "react";
import InQandAProfile from "./InQandAProfile";
import { FaPlus, FaThumbsUp, FaTag, FaCommentAlt } from "react-icons/fa";
import AnswerCard from "./AnswerCard";
import type { Answer, Question } from "./types.d";
const QuestionCard = ({
  question,
  handlePostAnswer,
  addQuestionsLike,
}: {
  addQuestionsLike: (_id: string | number) => void;
  question: Question;
  handlePostAnswer: (_answer: Answer) => void;
}) => {
  const { questionId, askerId, questionText, answers, likes, askedAt } = question;

  const [addAnswer, setAddAnswer] = useState(false);
  const { courseTitle } = { courseTitle: "AWS certification" };
  const [asker, setAsker] = useState<{
    id: string | number;
    name: string;
    imgUrl: string;
    qualification?: string;
  } | null>(null);
  const [seeAllAnswers, setSeeAllAnswers] = useState(false);
  const [answer, setAnswer] = useState<Answer>({
    questionId: questionId,
    answerId: "", //#todo: set this to the actual answer object
    answerText: "",
    answeredBy: askerId,
    likes: 0,
  });

  useEffect(() => {
    const fetchAskerDetail = async (askerId: string | number) => {
      console.log(`fetching data about ${askerId}`);
      setAsker({
        id: "1",
        name: "John Doe",
        imgUrl: `https://avatar.iran.liara.run/public/john_doe`,
      });
    };
    fetchAskerDetail(askerId);
  }, [askerId]);
  return (
    <div className="p-4l">
      <div className="flex flex-row justify-between items-center">
        {asker && <InQandAProfile {...{ ...asker, postedAt: askedAt }} />}

        <div className="flex flex-row justify-around items-center gap-2">
          <button
            className="flex flex-row gap-1 items-center cursor-pointer"
            onClick={() => {
              addQuestionsLike(questionId);
            }}
          >
            <FaThumbsUp size={15} color="grey" />
            {likes || 0}
          </button>
          <button
            className="flex flex-row gap-1 items-center cursor-pointer"
            onClick={() => setSeeAllAnswers(!seeAllAnswers)}
          >
            <FaCommentAlt size={15} color="grey" />
            {answers?.length ? answers.length : 0} Answers
          </button>
          <button className="flex flex-row gap-1 items-center cursor-pointer">
            <FaTag size={15} color="grey" /> {courseTitle}
          </button>
        </div>
      </div>
      <p className="text-gray-500 p-4 pl-8">{questionText}</p>
      <div className="flex flex-col divide-gray-500">
        {answers &&
          (seeAllAnswers ? (
            answers.map((answer) => (
              <AnswerCard {...answer} key={answer.answerId} />
            ))
          ) : (
            <AnswerCard {...answers[0]} />
          ))}
        {seeAllAnswers && answer && !addAnswer && (
          <button
            className="flex items-center bg-gray-200 w-fit my-2 gap-5 py-1 px-2 rounded-2xl"
            onClick={() => setAddAnswer(!addAnswer)}
          >
            <FaPlus size={20} color={"grey"} />
          </button>
        )}
        {addAnswer && (
          <form>
            <textarea
              className="w-full p-2 border border-gray-200 rounded-lg"
              autoFocus={true}
              value={answer.answerText}
              onChange={(e) => {
                setAnswer((prev) => {
                  return { ...prev, answerText: e.target.value };
                });
              }}
            />
            <button
              type="button"
              className="py-2 px-4 rounded-2xl"
              onClick={() => {
                handlePostAnswer(answer);
                setAnswer({ ...answer, answerText: "" });
                setAddAnswer(false);
              }}
            >
              Post Answer
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default QuestionCard;
