import SidebarNavigation from '@/components/SidebarNavigation';
import { authOptions } from '@/server/auth-options';
import { getEventsBySession } from '@/server/services/events-service';
import { getServerSession } from 'next-auth';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { EventCreatorButton } from '@/components/EventCreatorButton';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default async function Application() {
  const session = await getServerSession(authOptions);
  const events = await getEventsBySession(session);

  return (
    <SidebarNavigation currentPage="Dashboard">
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Your Upcoming Events</h2>
        <p className="mt-1 text-sm text-gray-600">
          Stay organized and keep track of your upcoming events. You can view details, edit, or manage your events here.
        </p>

        {events.length > 0 ? (
          <>
            <div className="mt-6">
              <EventCreatorButton />
            </div>

            <ul role="list" className="mt-5 divide-y divide-gray-100">
              {events.map((event) => (
                <li key={event.id} className="py-5">
                  <div className="rounded-md bg-gray-50 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-x-6">
                      <div className="min-w-0">
                        <div className="flex items-start gap-x-3">
                          <p className="text-sm font-semibold leading-6 text-gray-900">{event.title}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                          {event.eventDate && (
                            <p className="whitespace-nowrap">
                              Scheduled for {new Date(event.eventDate).toLocaleDateString()}
                            </p>
                          )}
                          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                            <circle r={1} cx={1} cy={1} />
                          </svg>
                          <p className="truncate">{event.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-none items-center gap-x-4">
                        <Link
                          href={`/application/dashboard/${event.id}`}
                          className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                        >
                          View Event<span className="sr-only">, {event.title}</span>
                        </Link>
                        <Menu as="div" className="relative flex-none">
                          <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                          </MenuButton>
                          <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                          >
                            <MenuItem>
                              <a
                                href="#"
                                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                              >
                                Edit<span className="sr-only">, {event.title}</span>
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="#"
                                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                              >
                                Move<span className="sr-only">, {event.title}</span>
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="#"
                                className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                              >
                                Delete<span className="sr-only">, {event.title}</span>
                              </a>
                            </MenuItem>
                          </MenuItems>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="mt-6">
            <button
              type="button"
              className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
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
            </button>
          </div>
        )}
      </div>
    </SidebarNavigation>
  );
}
