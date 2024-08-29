import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid'; // Import the Trash icon

type CustomField = {
  name: string;
  value: string;
};

type Props = {
  customFields: CustomField[];
  onCustomFieldChange: (updatedCustomFields: CustomField[]) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function CustomFieldForm({ customFields, onCustomFieldChange, onNext, onPrev }: Props) {
  const [fields, setFields] = useState<CustomField[]>(customFields);

  useEffect(() => {
    setFields(customFields);
  }, [customFields]);

  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [name]: value,
    };
    setFields(updatedFields);
    onCustomFieldChange(updatedFields);
  };

  const addCustomField = () => {
    const updatedFields = [...fields, { name: '', value: '' }];
    setFields(updatedFields);
    onCustomFieldChange(updatedFields);
  };

  const removeCustomField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
    onCustomFieldChange(updatedFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Custom Fields</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Add custom fields to your event.</p>

          {fields.map((field, index) => (
            <div key={index} className="relative mt-6 flex flex-col gap-y-4 rounded-lg bg-gray-100 p-4 shadow-sm">
              <div className="absolute right-2 top-2">
                <button type="button" onClick={() => removeCustomField(index)} className="text-gray-500 hover:text-gray-700">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex-grow">
                  <label htmlFor={`name-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                    Field Name
                  </label>
                  <div className="mt-2">
                    <input
                      id={`name-${index}`}
                      name="name"
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, e)}
                      type="text"
                      placeholder="Field Name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex-grow">
                  <label htmlFor={`value-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                    Field Value
                  </label>
                  <div className="mt-2">
                    <input
                      id={`value-${index}`}
                      name="value"
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, e)}
                      type="text"
                      placeholder="Field Value"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <button
              type="button"
              onClick={addCustomField}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Custom Field
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
          Next Step
        </button>
      </div>
    </form>
  );
}
