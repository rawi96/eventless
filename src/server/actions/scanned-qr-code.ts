'use server';

import { findAttendeeByHash, updateQrCodeStatus } from '../services/events-service';

export const checkScanner = async (decodedText: string) => {
  const attendee = await findAttendeeByHash(decodedText);
  console.error(attendee);

  // Here you can verify the decoded text (e.g., hash) against your event data
  if (attendee) {
    await updateQrCodeStatus(attendee.id);
    return 'success';
  } else {
    return 'error';
  }
};
