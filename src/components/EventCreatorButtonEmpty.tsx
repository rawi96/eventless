'use client';
import { useState } from 'react';
import { createNewEventAction } from '@/server/actions/create-new-event';

export const EventCreatorButtonEmpty = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await createNewEventAction();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={loading}
      className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        loading ? 'cursor-wait border-gray-300 text-gray-400' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      {loading ? (
        <svg
          className="mx-auto h-12 w-12 animate-spin text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      ) : (
        <>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto h-12 w-12 text-gray-400"
          >
            <path
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-2 block text-sm font-semibold text-gray-900">No Events Yet</span>
          <span className="mt-1 block text-sm text-gray-600">Create your first event to get started.</span>
        </>
      )}
    </button>
  );
};
