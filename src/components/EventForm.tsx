'use client';

import { updateEventAction } from '@/server/actions/update-event-action';
import { Event } from '@prisma/client';
import { Datepicker } from 'flowbite-react';

type Props = {
  event: Event;
};

export default function EventForm({ event }: Props) {
  return (
    <form action={(formData) => updateEventAction(formData, event)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Event Details</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please fill out the details of your event below.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  defaultValue={event.title}
                  type="text"
                  placeholder="Event Title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={event.description || ''}
                  placeholder="Event Description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="short-description" className="block text-sm font-medium leading-6 text-gray-900">
                Short Description
              </label>
              <div className="mt-2">
                <input
                  id="short-description"
                  name="short-description"
                  defaultValue={event.shortDescription || ''}
                  type="text"
                  placeholder="Brief summary of the event"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="event-date" className="block text-sm font-medium leading-6 text-gray-900">
                Event Date
              </label>
              <div className="mt-2">
                <Datepicker id="event-date" name="event-date" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="registration-end-date" className="block text-sm font-medium leading-6 text-gray-900">
                Registration End Date
              </label>
              <div className="mt-2">
                <Datepicker id="registration-end-date" name="registration-end-date" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
