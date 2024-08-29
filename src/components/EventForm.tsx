'use client';

import { useState } from 'react';
import { updateEventAction } from '@/server/actions/update-event-action';
import { Event } from '@prisma/client';
import CustomFieldForm from './CustomFieldForm';
import EventDetailsForm from './EventDetailsForm';
import QuestionsForm from './QuestionsForm';
import StepIndicator from './StepIndicator';

type Props = {
  event: Event;
};

export default function EventForm({ event }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    shortDescription: event.shortDescription || '',
    eventDate: '',
    registrationEndDate: '',
    customField: '',
    question: '',
  });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalFormData = new FormData();
      finalFormData.append('title', formData.title);
      finalFormData.append('description', formData.description);
      finalFormData.append('short-description', formData.shortDescription);
      finalFormData.append('event-date', formData.eventDate);
      finalFormData.append('registration-end-date', formData.registrationEndDate);
      finalFormData.append('customField', formData.customField);
      finalFormData.append('question', formData.question);

      updateEventAction(finalFormData, event);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <EventDetailsForm formData={formData} onFieldChange={handleFieldChange} onNext={handleNextStep} />
      )}

      {currentStep === 2 && (
        <CustomFieldForm
          formData={formData}
          onFieldChange={handleFieldChange}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 3 && (
        <QuestionsForm
          formData={formData}
          onFieldChange={handleFieldChange}
          onPrev={handlePrevStep}
          onSubmit={handleNextStep}
        />
      )}
    </div>
  );
}
