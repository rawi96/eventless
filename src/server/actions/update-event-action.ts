'use server';

import { redirect } from 'next/navigation';
import { updateEvent } from '../services/events-service';
import { Event } from '@prisma/client';

export const updateEventAction = async (formData: FormData, event: Event) => {
  try {
    // Extract custom fields from formData
    const customFields: { name: string; value: string }[] = [];
    let index = 0;

    while (true) {
      const fieldName = formData.get(`customFieldName-${index}`);
      const fieldValue = formData.get(`customFieldValue-${index}`);
      if (fieldName && fieldValue) {
        customFields.push({
          name: fieldName as string,
          value: fieldValue as string,
        });
        index++;
      } else {
        break;
      }
    }

    // Create the updated event object
    const updatedEvent: Event = {
      ...event,
      title: formData.get('title') as string,
      description: formData.get('description') as string | null,
      shortDescription: formData.get('short-description') as string | null,
      eventDate: formData.get('event-date') ? new Date(formData.get('event-date') as string) : null,
      registrationEndDate: formData.get('registration-end-date')
        ? new Date(formData.get('registration-end-date') as string)
        : null,
    };

    // Call the updateEvent function with the event and customFields
    await updateEvent(updatedEvent, customFields);

    console.log('Event updated successfully');
  } catch (error) {
    console.error('Failed to update event:', error);
  }
  redirect(`/application/dashboard`);
};
