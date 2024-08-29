'use client';
import { createNewEventAction } from '@/server/actions/create-new-event';
import { Button } from './Button';

export const EventCreatorButton = () => <Button onClick={() => createNewEventAction()}>Create new Event</Button>;
