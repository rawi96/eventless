import ExportToCsv from '@/components/ExportToCSV';
import SidebarNavigation from '@/components/SidebarNavigation';
import { getFullEventById } from '@/server/services/events-service';
import { notFound } from 'next/navigation';
import { useState } from 'react';

export default async function Application({ params }: { params: { eventId: string } }) {
  const event = await getFullEventById(params.eventId);

  if (!event) {
    return notFound();
  }

  return (
    <SidebarNavigation currentPage="Dashboard">
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="mb-4 text-3xl font-bold">Event Details</h1>
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-2xl font-semibold">{event.title}</h2>
          <p className="text-gray-700">{event.description}</p>
          <p className="mt-2 text-gray-600">
            <strong>Event Date:</strong> {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Registration End Date:</strong>{' '}
            {event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : 'N/A'}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Status:</strong> {event.isClosed ? 'Closed' : 'Open'}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold">Attendees ({event.attendees.length})</h3>

          {event.attendees.length === 0 ? (
            <p className="mt-4 text-gray-600">No attendees found.</p>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Registration Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {event.attendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td className="whitespace-nowrap px-6 py-4">{attendee.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">{new Date(attendee.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <ExportToCsv id={event.id} title={event.title} />
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarNavigation>
  );
}
