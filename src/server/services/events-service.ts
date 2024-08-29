import { Session } from 'next-auth';
import { prisma } from '../prisma/prisma';

export const getEventsBySession = async (session: Session | null) => {
  if (!session?.user.id) {
    return [];
  }
  return await prisma.event.findMany({
    where: {
      userId: session.user.id,
    },
  });
};

export const createRandomEvent = async (session: Session | null) => {
  const randomNum = Math.floor(Math.random() * 100);
  if (!session?.user.id) {
    return null;
  }
  return await prisma.event.create({
    data: {
      title: 'Random Event',
      description: `#${randomNum}`,
      userId: session.user.id,
    },
  });
};

export const getEventsById = async (id: string) => {
  return await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      questions: true,
      customFields: true,
    },
  });
};

export const existsAttandeeForEvent = async (eventId: string, email: string) => {
  return await prisma.attendee.findFirst({
    where: {
      eventId,
      email,
    },
  });
};

export const createAttendee = async (
  eventId: string,
  email: string,
  answers: { questionId: string; answerText: string }[],
) => {
  return await prisma.attendee.create({
    data: {
      email,
      eventId,
      answers: {
        create: answers,
      },
    },
  });
};
