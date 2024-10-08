import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid'; // Import the Trash icon
import { Question } from '@prisma/client';

type Props = {
  questions: Question[];
  onQuestionChange: (updatedQuestions: Question[]) => void;
  onPrev: () => void;
  onSubmit: () => void;
};

export default function QuestionsForm({ questions, onQuestionChange, onPrev, onSubmit }: Props) {
  const [questionList, setQuestionList] = useState<Question[]>(questions);
  const [options, setOptions] = useState<{ [key: number]: string[] }>(
    questions.map((_, index) =>
      ['multiple-choice', 'single-select'].includes(questions[index].type)
        ? [...(questions[index].attributes ? JSON.parse(questions[index].attributes) : [])]
        : [],
    ),
  ); // Manage options for multiple-choice and single-select

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

    if (['multiple-choice', 'single-select'].includes(value)) {
      // Initialize options for new multiple-choice or single-select questions
      setOptions((prev) => ({
        ...prev,
        [index]: options[index] || [''], // Start with one empty option
      }));
    }

    if (name === 'type' && value === 'text') {
      // Clear options if question type changes from multiple-choice or single-select to text
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
    const newQuestion: Question = {
      questionText: '',
      type: 'text',
      attributes: '',
      isRequired: false,
      id: '',
      eventId: '',
      createdAt: new Date(),
      updatedAt: null,
    };
    const updatedQuestions = [...questionList, newQuestion];
    setQuestionList(updatedQuestions);
    onQuestionChange(updatedQuestions);

    // Initialize options for the new question if it's multiple-choice or single-select
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
            <div key={index} className="relative mt-6 flex flex-col gap-y-4 rounded-lg bg-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="absolute right-2 top-2 p-1 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="single-select">Single Select</option>
                </select>
              </div>

              {['multiple-choice', 'single-select'].includes(question.type) && (
                <>
                  {options[index]?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-x-4">
                      {question.type === 'single-select' ? (
                        <input
                          type="radio"
                          name={`single-select-${index}`}
                          disabled
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          name={`multiple-choice-${index}-${optionIndex}`}
                          disabled
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                      )}
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Add Option
                  </button>
                </>
              )}
            </div>
          ))}

          <div className="mt-6">
            <button
              type="button"
              onClick={addQuestion}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
