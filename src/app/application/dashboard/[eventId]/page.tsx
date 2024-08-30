import ExportToCsv from '@/components/ExportToCSV';
import SidebarNavigation from '@/components/SidebarNavigation';
import { getFullEventById } from '@/server/services/events-service';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notFound } from 'next/navigation';

const isPastDate = (date: Date | null | undefined) => {
  return date ? new Date(date) < new Date() : false;
};

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
          {/* Event Date */}
          <div className="mt-2 flex items-center text-gray-600">
            <span className={`${isPastDate(event.eventDate) ? 'text-red-600' : ''}`}>
              <strong>Event Date:</strong> {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}
              {isPastDate(event.eventDate) && (
                <span className="ml-2 text-red-600">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 h-3 w-3" />
                  Past
                </span>
              )}
            </span>
          </div>

          {/* Registration End Date */}
          <div className="mt-2 flex items-center text-gray-600">
            <span className={`${isPastDate(event.registrationEndDate) ? 'text-red-600' : ''}`}>
              <strong>Registration End Date:</strong>{' '}
              {event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : 'N/A'}
              {isPastDate(event.registrationEndDate) && (
                <span className="ml-2 text-red-600">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 h-3 w-3" />
                  Past
                </span>
              )}
            </span>
          </div>
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
                    {event.questions.map((question) => (
                      <th
                        key={question.id}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {question.questionText}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {event.attendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td className="whitespace-nowrap px-6 py-4">{attendee.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">{new Date(attendee.createdAt).toLocaleDateString()}</td>
                      {event.questions.map((question) => (
                        <td key={question.id} className="whitespace-nowrap px-6 py-4">
                          {attendee.answers.find((answer) => answer.questionId === question.id)?.answerText}
                        </td>
                      ))}
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
