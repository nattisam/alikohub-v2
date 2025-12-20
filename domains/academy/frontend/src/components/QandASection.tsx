import { useState } from "react";
import QuestionCard from "./QuestionCard";
import InQandAProfile from "./InQandAProfile";
import type { Contributor, Question, Answer } from "./types.d";
const contributors: Contributor[] = [
  {
    id: "1",
    name: "Abinet Abate",
    imgUrl: `https://avatar.iran.liara.run/public/male/abinet_abate`,
    qualification: "Cloud Architect",
  },
  {
    id: "2",
    name: "John Doe",
    imgUrl: `https://avatar.iran.liara.run/public/john_doe`,
    qualification: "Cloud Engineer",
  },
  {
    id: "3",
    name: "Jane Smith",
    imgUrl: `https://avatar.iran.liara.run/public/jane_smith`,
    qualification: "Cloud Manager",
  },
  {
    id: "4",
    name: "Alice Johnson",
    imgUrl: `https://avatar.iran.liara.run/public/${"alice" + "johnson"}`,
    qualification: "Cloud Architect",
  },
];
const QandASection = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question>({
    askerId: "",
    questionId: "",
    questionText: "",
    askedAt: "",
  });
  const handleLikingQuestion = (id: string | number) => {
    setQuestions(
      questions.map((question) => {
        if (question.questionId == id) {
          return {
            ...question,
            likes: question.likes ? question.likes + 1 : 1,
          };
        }
        return question;
      })
    );
  };
  const handlePostQuestion = (question: Question) => {
    // TODO: Handle posting question to the server
    console.log(`the question is ${JSON.stringify(question)}`);
  };
  const handlePostAnswer = (answer: Answer) => {
    // TODO: Handle posting answer to the server
    setQuestions(
      questions.map((question) => {
        if (question.questionId == answer.questionId) {
          return {
            ...question,
            answers: question.answers
              ? [...question.answers, answer]
              : [answer],
          };
        }
        return question;
      })
    );
    console.log(`the answer is ${JSON.stringify(answer)}`);
  };
  return (
    <section className="my-20 px-5 md:px-10 lg:px-15">
      <h2 className="font-semibold text-center text-4xl">
        Q&A with Instructors
      </h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className=" flex flex-col gap-5 divide-y-2 divide-gray-200 md:col-span-7 overflow-y-auto overflow-x-hidden bg-white rounded-lg p-5">
          {questions.length === 0 ? (
            <p className="p-5">No questions have been asked yet.</p>
          ) : (
            questions.map((question, index) => (
              <QuestionCard
                {...{
                  question: question,
                  handlePostAnswer: handlePostAnswer,
                  addQuestionsLike: handleLikingQuestion,
                }}
                key={index}
              />
            ))
          )}
        </div>
        <div className="flex flex-col md:col-start-9 md:col-span-4">
          <div className="bg-white p-4 rounded-lg my-2">
            <h3 className="font-semibold text-2xl">Ask a Question</h3>
            <form className="mt-5">
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                placeholder="What would you like to know?"
                onChange={(e) =>
                  setQuestion({
                    ...question,
                    questionText: e.target.value,
                    askedAt: new Date(),
                  })
                }
                value={question.questionText}
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setQuestions((prevQuestions) => {
                    return [{...question,questionId:Date.now()}, ...prevQuestions ];
                  });
                  handlePostQuestion(question);
                  setQuestion({ ...question, questionText: "" });
                }}
              >
                Post Question
              </button>
            </form>
          </div>
          <div className="bg-white p-4 rounded-lg my-2">
            <h3>Top Contributors</h3>
            <div className="divider-gray-500 flex flex-col overflow-y-auto">
              {contributors.map((contributor) => (
                <InQandAProfile {...contributor} key={contributor.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default QandASection;
