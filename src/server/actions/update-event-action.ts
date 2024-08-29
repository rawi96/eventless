'use server';

import { redirect } from 'next/navigation';
import { CustomField, Event, Question } from '@prisma/client';
import { updateEvent } from '../services/events-service';

// Define types or interfaces for CustomField and Question as needed
export interface CustomFieldInput {
  name: string;
  value: string;
}

export interface QuestionInput {
  questionText: string;
  type: string;
  attributes: string; // JSON string
  isRequired: boolean;
}

const extractCustomFields = (formData: FormData): CustomFieldInput[] => {
  const customFields: CustomFieldInput[] = [];
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

  return customFields;
};

const extractQuestions = (formData: FormData): QuestionInput[] => {
  const questions: QuestionInput[] = [];
  let index = 0;

  while (true) {
    const questionText = formData.get(`questionText-${index}`);
    const questionType = formData.get(`questionType-${index}`);
    const questionAttributes = formData.get(`questionAttributes-${index}`);
    const questionIsRequired = formData.get(`questionIsRequired-${index}`);

    if (questionText && questionType) {
      questions.push({
        questionText: questionText as string,
        type: questionType as string,
        attributes: questionAttributes ? (questionAttributes as string) : '', // Default to empty string if not present
        isRequired: questionIsRequired === 'true',
      });
      index++;
    } else {
      break;
    }
  }

  return questions;
};

const buildUpdatedEvent = (formData: FormData, event: Event): Event => ({
  ...event,
  title: formData.get('title') as string,
  description: formData.get('description') as string | null,
  shortDescription: formData.get('short-description') as string | null,
  eventDate: formData.get('event-date') ? new Date(formData.get('event-date') as string) : null,
  registrationEndDate: formData.get('registration-end-date')
    ? new Date(formData.get('registration-end-date') as string)
    : null,
});

export const updateEventAction = async (formData: FormData, event: Event) => {
  try {
    console.log('formData:', formData);

    const customFields = extractCustomFields(formData);
    const questions = extractQuestions(formData);
    const updatedEvent = buildUpdatedEvent(formData, event);

    await updateEvent(updatedEvent, customFields, questions);

    console.log('Event updated successfully');
  } catch (error) {
    console.error('Failed to update event:', error);
  }

  redirect(`/application/dashboard`);
};
