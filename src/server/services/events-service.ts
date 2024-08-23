import { Session } from 'next-auth'
import { prisma } from '../prisma/prisma'

export const getEventsBySession = async (session: Session | null) => {
  if (!session?.user.id) {
    return []
  }
  return await prisma.event.findMany({
    where: {
      userId: session.user.id,
    },
  })
}

export const createRandomEvent = async (session: Session | null) => {
  const randomNum = Math.floor(Math.random() * 100)
  if (!session?.user.id) {
    return null
  }
  return await prisma.event.create({
    data: {
      title: 'Random Event',
      description: `#${randomNum}`,
      userId: session.user.id,
    },
  })
}
