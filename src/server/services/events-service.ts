import { Session } from 'next-auth'
import { prisma } from '../prisma/prisma'

export const getEventsBySession = async (session: Session | null) => {
  if (!session?.user?.email) {
    return []
  }
  return await prisma.event.findMany({
    where: {
      userId: session.user.email,
    },
  })
}
