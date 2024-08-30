'use client';
import { createNewEventAction } from '@/server/actions/create-new-event';

export const EventCreatorButton = () => (
  <button
    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    onClick={() => createNewEventAction()}
  >
    Create new Event
  </button>
);
