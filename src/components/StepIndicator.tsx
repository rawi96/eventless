export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex w-full items-center text-center text-sm font-medium text-gray-500 sm:text-base dark:text-gray-400">
      <li className={`flex items-center md:w-full ${currentStep > 1 ? 'text-blue-600' : 'text-gray-500'}`}>
        <span className="flex items-center">
          <svg
            className="me-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          Personal Info
        </span>
      </li>
      <li className={`flex items-center md:w-full ${currentStep > 2 ? 'text-blue-600' : 'text-gray-500'}`}>
        <span className="flex items-center">
          <span className="me-2">2</span>
          Custom Field
        </span>
      </li>
      <li className={`flex items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-500'}`}>
        <span className="me-2">3</span>
        Questions
      </li>
    </ol>
  );
}
