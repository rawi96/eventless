import SidebarNavigation from '@/components/SidebarNavigation';
import { authOptions } from '@/server/auth-options';
import { getEventsBySession } from '@/server/services/events-service';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Application() {
  const session = await getServerSession(authOptions);
  const events = await getEventsBySession(session);

  return (
    <SidebarNavigation currentPage="Dashboard">
      <div className="mt-10">
        <h2 className="text-xl font-bold">Your Events:</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Link href={`/application/dashboard/${event.id}`}>
                {event.title} - {event.description}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SidebarNavigation>
  );
}
