import { getEventsById } from '@/server/services/events-service';
import { Event } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type ErrorMessage = {
  code: string;
  message: string;
};

type ResponseData = Event | ErrorMessage;

const validateAuthorizationHeader = async (authorizationHeader: string | null) => {
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

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('Authorization'));
  if (!decodedBearerToken) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: `Your API Key is invalid.` }, { status: 401 });
  }

  try {
    const event = await getEventsById(context.params.id);
    if (!event) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: `Event with id ${context.params.id} not found` },
        { status: 400 },
      );
    }

    // if (event.registrationEndDate && event.registrationEndDate < new Date()) {
    //   return res.status(401).json({
    //     code: 'REGISTRATION_EXCEEDED',
    //     message: `Registration is not possible anymore. deadline ended on ${event.registrationEndDate}`,
    //   });
    // }

    return NextResponse.json(event, { status: 200 });
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
