import HostForm from '@/components/HostForm';
import SidebarNavigation from '@/components/SidebarNavigation';
import { getFullEventById } from '@/server/services/events-service';
import { notFound } from 'next/navigation';

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
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          </div>
        </div>

        <HostForm event={event} />
      </div>
    </SidebarNavigation>
  );
}
