import { EventCreatorButton } from '@/components/EventCreatorButton';
import SidebarNavigation from '@/components/SidebarNavigation';
import { authOptions } from '@/server/auth-options';
import { getServerSession } from 'next-auth';

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  return <SidebarNavigation currentPage="Events">{<EventCreatorButton />}</SidebarNavigation>;
}
