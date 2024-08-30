import {
  createAttendee,
  existsAttandeeForEvent,
  findAttendeeByHash,
  getEventById,
  updateQrCodeStatus,
} from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

type Registration = {
  hash: string;
};

const validateAuthorizationHeader = (authorizationHeader: string | null) => {
  try {
    if (!authorizationHeader) {
      return false;
    }
    //validate the token
    return authorizationHeader === process.env.API_KEY;
  } catch (e) {
    console.error(e, 'Error validating token');
    return false;
  }
};

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('api-key'));
  if (!decodedBearerToken) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: `Your API Key is invalid.` }, { status: 401 });
  }

  try {
    const event = await getEventById(context.params.id);
    if (!event) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: `Event with id ${context.params.id} not found` },
        { status: 400 },
      );
    }

    const registration = (await req.json()) as Registration;

    const attendee = await findAttendeeByHash(registration.hash);

    if (!attendee) {
      return NextResponse.json(
        { code: 'NOT_REGISTERED', message: `You are not registered for this event` },
        { status: 400 },
      );
    }

    await updateQrCodeStatus(attendee.id);
    return NextResponse.json({ code: 'OK', message: `Sänks for visiting üs.` }, { status: 200 });
  } catch (e) {
    console.error(e, 'Error getting event by id');
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: `please wait a moment and try again`,
      },
      { status: 500 },
    );
  }
}
