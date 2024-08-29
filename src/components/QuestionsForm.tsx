import { useState, useEffect } from 'react';

type Question = {
  questionText: string;
  type: string;
  attributes: string;
  isRequired: boolean;
};

type Props = {
  questions: Question[];
  onQuestionChange: (updatedQuestions: Question[]) => void;
  onPrev: () => void;
  onSubmit: () => void;
};

export default function QuestionsForm({ questions, onQuestionChange, onPrev, onSubmit }: Props) {
  const [questionList, setQuestionList] = useState<Question[]>(questions);

  useEffect(() => {
    setQuestionList(questions);
  }, [questions]);

  const handleQuestionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const updatedQuestions = [...questionList];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value,
    };
    setQuestionList(updatedQuestions);
    onQuestionChange(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion = { questionText: '', type: 'text', attributes: '', isRequired: false };
    const updatedQuestions = [...questionList, newQuestion];
    setQuestionList(updatedQuestions);
    onQuestionChange(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questionList.filter((_, i) => i !== index);
    setQuestionList(updatedQuestions);
    onQuestionChange(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Questions</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please add your questions below.</p>

          {questionList.map((question, index) => (
            <div key={index} className="mt-6 flex flex-col gap-y-4">
              <div>
                <label htmlFor={`questionText-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Question
                </label>
                <input
                  id={`questionText-${index}`}
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(index, e)}
                  type="text"
                  placeholder="Your question"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label htmlFor={`type-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Type
                </label>
                <select
                  id={`type-${index}`}
                  name="type"
                  value={question.type}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  {/* Add more types if needed */}
                </select>
              </div>

              <div>
                <label htmlFor={`attributes-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Attributes
                </label>
                <input
                  id={`attributes-${index}`}
                  name="attributes"
                  value={question.attributes}
                  onChange={(e) => handleQuestionChange(index, e)}
                  type="text"
                  placeholder="Attributes (e.g., choices for multiple-choice)"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label htmlFor={`isRequired-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  Is Required?
                </label>
                <input
                  id={`isRequired-${index}`}
                  name="isRequired"
                  type="checkbox"
                  checked={question.isRequired}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 sm:text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-sm font-semibold leading-6 text-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <button
              type="button"
              onClick={addQuestion}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={onPrev}>
          Previous
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
