type Props = {
  formData: any;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrev: () => void;
  onSubmit: () => void;
};

export default function QuestionsForm({ formData, onFieldChange, onPrev, onSubmit }: Props) {
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

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="question" className="block text-sm font-medium leading-6 text-gray-900">
                Question
              </label>
              <div className="mt-2">
                <input
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={onFieldChange}
                  type="text"
                  placeholder="Your question"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
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
