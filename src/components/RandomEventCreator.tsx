'use client';

import { createRandomEventAction } from '@/server/actions/create-random-event';
import { Button } from './Button';

export const RandomEventCreator = () => <Button onClick={() => createRandomEventAction()}>Create Random Event</Button>;
