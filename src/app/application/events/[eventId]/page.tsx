import EventForm from '@/components/EventForm';
import SidebarNavigation from '@/components/SidebarNavigation';
import { getEventById } from '@/server/services/events-service';

export default async function CreateEventPage({ params }: { params: { eventId: string } }) {
  const event = await getEventById(params.eventId);

  return (
    <SidebarNavigation currentPage="Events">
      {event ? <EventForm event={event} /> : <div className="text-center">Event not found</div>}
    </SidebarNavigation>
  );
}
