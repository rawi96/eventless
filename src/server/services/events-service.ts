import { Event } from '@prisma/client';
import { getServerSession, Session } from 'next-auth';
import { CustomFieldInput, QuestionInput } from '../actions/update-event-action';
import { prisma } from '../prisma/prisma';
import { authOptions } from '../auth-options';

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

export const getEventsWhereRegistrationIsPossible = async () => {
  return await prisma.event.findMany({
    where: {
      OR: [
        {
          registrationEndDate: {
            gt: new Date(),
          },
        },
        {
          registrationEndDate: null,
        },
      ],
    },
  });
};

export const createNewEvent = async (session: Session | null): Promise<Event | null> => {
  if (!session?.user.id) {
    return null;
  }
  return await prisma.event.create({
    data: {
      title: 'New Event',
      userId: session.user.id,
    },
  });
};

export const updateEvent = async (event: Event, customFields: CustomFieldInput[], questions: QuestionInput[]) => {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return null;
  }

  // Update the event with custom fields and questions
  const updatedEvent = await prisma.event.update({
    where: {
      id: event.id,
    },
    data: {
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription,
      eventDate: event.eventDate,
      registrationEndDate: event.registrationEndDate,
      customFields: {
        deleteMany: {}, // Clear existing custom fields to avoid duplicates
        create: customFields.map(({ name, value }) => ({
          name,
          value,
        })),
      },
      questions: {
        deleteMany: {}, // Clear existing questions
        create: questions.map(({ questionText, type, attributes, isRequired }) => ({
          questionText,
          type,
          attributes,
          isRequired,
        })),
      },
    },
  });

  return updatedEvent;
};

export const createEvent = async (session: Session | null, event: Event) => {
  if (!session?.user.id) {
    return null;
  }
  return await prisma.event.create({
    data: {
      ...event,
      userId: session.user.id,
    },
  });
};

export const getEventById = async (id: string) => {
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

export const getFullEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      questions: true,
      customFields: true,
      attendees: true
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
