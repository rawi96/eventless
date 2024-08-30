import ExportToCsv from '@/components/ExportToCSV';
import SidebarNavigation from '@/components/SidebarNavigation';
import { getFullEventById } from '@/server/services/events-service';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
      <div className="mt-10">
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>

            <Link href={`/application/events/${event.id}`} passHref>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Edit Event
              </button>
            </Link>
          </div>

          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Title</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{event.title}</dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Description</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{event.description}</dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Event Date</dt>
                <dd
                  className={`mt-1 text-sm leading-6 ${
                    isPastDate(event.eventDate) ? 'text-red-600' : 'text-gray-700'
                  } sm:col-span-2 sm:mt-0`}
                >
                  {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}
                  {isPastDate(event.eventDate) && (
                    <span className="ml-2 text-red-600">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 h-3 w-3" />
                      Past
                    </span>
                  )}
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Registration End Date</dt>
                <dd
                  className={`mt-1 text-sm leading-6 ${
                    isPastDate(event.registrationEndDate) ? 'text-red-600' : 'text-gray-700'
                  } sm:col-span-2 sm:mt-0`}
                >
                  {event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : 'N/A'}
                  {isPastDate(event.registrationEndDate) && (
                    <span className="ml-2 text-red-600">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 h-3 w-3" />
                      Past
                    </span>
                  )}
                </dd>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {event.isClosed ? 'Closed' : 'Open'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Attendees ({event.attendees.length})</h3>
            <ExportToCsv id={event.id} title={event.title} />
          </div>

          {event.attendees.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">No attendees found.</p>
          ) : (
            <>
              <table className="mt-4 min-w-full divide-y divide-gray-200 bg-white shadow-sm">
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
                <tbody className="divide-y divide-gray-200">
                  {event.attendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{attendee.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {new Date(attendee.createdAt).toLocaleDateString()}
                      </td>
                      {event.questions.map((question) => (
                        <td key={question.id} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {attendee.answers.find((answer) => answer.questionId === question.id)?.answerText || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </SidebarNavigation>
  );
}
