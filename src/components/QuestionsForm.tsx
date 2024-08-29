import { useState, useEffect } from 'react';

type Question = {
  questionText: string;
  type: string;
  attributes: string; // This will hold JSON string for options
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
  const [options, setOptions] = useState<{ [key: number]: string[] }>({}); // Manage options for multiple-choice

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

    if (name === 'type' && value === 'multiple-choice') {
      // Initialize options for new multiple-choice questions
      setOptions((prev) => ({
        ...prev,
        [index]: options[index] || [''], // Start with one empty option
      }));
    }

    if (name === 'type' && value === 'text') {
      // Clear options if question type changes from multiple-choice to text
      setOptions((prev) => ({
        ...prev,
        [index]: [],
      }));
    }

    onQuestionChange(updatedQuestions);
  };

  const handleOptionChange = (index: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const updatedOptions = { ...options };
    if (updatedOptions[index]) {
      updatedOptions[index][optionIndex] = value;
      setOptions(updatedOptions);

      // Update question attributes with new options
      const updatedQuestions = [...questionList];
      updatedQuestions[index].attributes = JSON.stringify(updatedOptions[index]);
      setQuestionList(updatedQuestions);
      onQuestionChange(updatedQuestions);
    }
  };

  const addOption = (index: number) => {
    const updatedOptions = { ...options };
    if (updatedOptions[index]) {
      updatedOptions[index].push('');
      setOptions(updatedOptions);

      // Update question attributes with new options
      const updatedQuestions = [...questionList];
      updatedQuestions[index].attributes = JSON.stringify(updatedOptions[index]);
      setQuestionList(updatedQuestions);
      onQuestionChange(updatedQuestions);
    }
  };

  const removeOption = (index: number, optionIndex: number) => {
    const updatedOptions = { ...options };
    if (updatedOptions[index]) {
      updatedOptions[index].splice(optionIndex, 1);
      setOptions(updatedOptions);

      // Update question attributes with new options
      const updatedQuestions = [...questionList];
      updatedQuestions[index].attributes = JSON.stringify(updatedOptions[index]);
      setQuestionList(updatedQuestions);
      onQuestionChange(updatedQuestions);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = { questionText: '', type: 'text', attributes: '', isRequired: false };
    const updatedQuestions = [...questionList, newQuestion];
    setQuestionList(updatedQuestions);
    onQuestionChange(updatedQuestions);

    // Initialize options for the new question if it's multiple-choice
    setOptions((prev) => ({
      ...prev,
      [updatedQuestions.length - 1]: [],
    }));
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questionList.filter((_, i) => i !== index);
    setQuestionList(updatedQuestions);

    // Remove options associated with the removed question
    const updatedOptions = { ...options };
    delete updatedOptions[index];
    setOptions(updatedOptions);

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
                </select>
              </div>

              {question.type === 'multiple-choice' && (
                <>
                  {options[index]?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-x-4">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-sm font-semibold leading-6 text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Option
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-sm font-semibold leading-6 text-red-600"
              >
                Remove Question
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
