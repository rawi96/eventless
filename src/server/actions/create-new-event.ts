'use server';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { createNewEvent } from '../services/events-service';

export const createNewEventAction = async () => {
  const session = await getServerSession(authOptions);

  const event = await createNewEvent(session);

  if (!event) {
    throw new Error('Failed to create event');
  }

  redirect(`/application/events/${event.id}`);
};
