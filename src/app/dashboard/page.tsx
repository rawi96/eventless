import SidebarNavigation from '@/components/SidebarNavigation'
import { authOptions } from '@/server/auth-options'
import { getEventsBySession } from '@/server/services/events-service'
import { getServerSession } from 'next-auth'

export default async function Application() {
  const session = await getServerSession(authOptions)

  const events = await getEventsBySession(session)
  return (
    <>
      <SidebarNavigation>
        Your Events:
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      </SidebarNavigation>
    </>
  )
}
