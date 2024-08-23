import { RandomEventCreator } from '@/components/RandomEventCreator'
import SidebarNavigation from '@/components/SidebarNavigation'
import { authOptions } from '@/server/auth-options'
import { getEventsBySession } from '@/server/services/events-service'
import { getServerSession } from 'next-auth'

export default async function Application() {
  const session = await getServerSession(authOptions)
  const events = await getEventsBySession(session)

  return (
    <SidebarNavigation>
      <RandomEventCreator />

      <div className="mt-10">
        <h2 className="text-xl font-bold">Your Events:</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {event.title} - {event.description}
            </li>
          ))}
        </ul>
      </div>
    </SidebarNavigation>
  )
}
