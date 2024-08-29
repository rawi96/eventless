import { getEventById } from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

const validateAuthorizationHeader = (authorizationHeader: string | null) => {
  try {
    console.error('authorizationHeader', authorizationHeader);
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
