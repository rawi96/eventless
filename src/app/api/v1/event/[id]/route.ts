import * as jose from 'jose';
import { NextRequest } from 'next/server';

const validateAuthorizationHeader = async (authorizationHeader: string | null) => {
  try {
    if (!authorizationHeader) {
      return false;
    }
    //validate the token
  } catch (e) {
    console.error(e, 'Error validating token');
    return false;
  }
};

export async function GET(req: NextRequest, context: { params: { alias: string } }) {
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('Authorization'));
  if (!decodedBearerToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // if (!istDerEventAbgelaufen()) {
    // return new Response('INVALID', { status: 400, headers: CORS_HEADERS });
    // }

    return new Response('', { status: 200 });
  } catch (e) {
    return new Response('ERROR', { status: 500 });
  }
}
