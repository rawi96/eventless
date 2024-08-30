'use client';
import { useState } from 'react';
import { createNewEventAction } from '@/server/actions/create-new-event';

export const EventCreatorButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await createNewEventAction();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        loading ? 'cursor-wait bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <svg
          className="mr-2 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      ) : (
        'Create New Event'
      )}
    </button>
  );
};
