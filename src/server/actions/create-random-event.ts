'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth-options';
import { createRandomEvent } from '../services/events-service';
import { revalidatePath } from 'next/cache';

export const createRandomEventAction = async () => {
  const session = await getServerSession(authOptions);

  const event = await createRandomEvent(session);

  revalidatePath('/application');
  return event;
};
