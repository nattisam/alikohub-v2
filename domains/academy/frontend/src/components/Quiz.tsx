import { useState } from "react";
interface QuizSectionProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
}

const QuizSection: React.FC<QuizSectionProps> = ({ question, options, currentQuestion, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Quick Knowledge Check</h2>
      <p className="text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
      <p className="mt-4 text-lg">{question}</p>
      <div className="mt-4 space-y-2">
        {options.map((option, index) => (
          <div key={index}>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="quiz"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Next Question</button>
        <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Skip</button>
      </div>
    </div>
  );
};

export default QuizSection;