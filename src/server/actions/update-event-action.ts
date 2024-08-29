'use server';

import { redirect } from 'next/navigation';
import { updateEvent } from '../services/events-service';
import { Event } from '@prisma/client';

export const updateEventAction = async (formData: FormData, event: Event) => {
  try {
    const updatedEvent: Event = {
      ...event,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('short-description') as string,
      eventDate: new Date(formData.get('event-date') as string),
      registrationEndDate: new Date(formData.get('registration-end-date') as string),
    };

    await updateEvent(updatedEvent);

    console.log('Event updated successfully');
  } catch (error) {
    console.error('Failed to update event:', error);
  }
  redirect(`/application/dashboard`);
};
