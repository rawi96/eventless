import { useState } from 'react';

type CustomField = {
  name: string;
  value: string;
};

type Props = {
  formData: any;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: (updatedFormData: any) => void;
  onPrev: () => void;
};

export default function CustomFieldForm({ formData, onFieldChange, onNext, onPrev }: Props) {
  const [customFields, setCustomFields] = useState<CustomField[]>([{ name: '', value: '' }]);

  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const fields = [...customFields];
    fields[index] = {
      ...fields[index],
      [name]: value,
    };
    setCustomFields(fields);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
  };

  const removeCustomField = (index: number) => {
    const fields = [...customFields];
    fields.splice(index, 1);
    setCustomFields(fields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = { ...formData, customFields };
    onNext(updatedFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Custom Fields</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Add custom fields to your event.</p>

          {customFields.map((field, index) => (
            <div key={index} className="mt-6 flex items-end gap-x-4 sm:grid-cols-6">
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

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="text-sm font-semibold leading-6 text-red-600"
                >
                  Remove
                </button>
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
