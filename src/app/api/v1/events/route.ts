import { getEventsWhereRegistrationIsPossible } from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

export async function GET(req: NextRequest) {
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('Authorization'));
  if (!decodedBearerToken) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: `Your API Key is invalid.` },
      { status: 401, headers: CORS_HEADERS },
    );
  }

  try {
    const events = await getEventsWhereRegistrationIsPossible();
    return NextResponse.json(events, { status: 200, headers: CORS_HEADERS });
  } catch (e) {
    console.error(e, 'Error getting events');
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: `please wait a moment and try again`,
      },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
