import { getEventById } from '@/server/services/events-service';
import { Event } from '@prisma/client';
import { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

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

export async function GET(req: NextRequest, res: NextApiResponse<ResponseData>, context: { params: { id: string } }) {
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('Authorization'));
  if (!decodedBearerToken) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: `Your API Key is invalid.` });
  }

  try {
    const event = await getEventById(context.params.id);
    if (!event) {
      return res.status(400).json({ code: 'NOT_FOUND', message: `Event with id ${context.params.id} not found` });
    }

    // if (event.registrationEndDate && event.registrationEndDate < new Date()) {
    //   return res.status(401).json({
    //     code: 'REGISTRATION_EXCEEDED',
    //     message: `Registration is not possible anymore. deadline ended on ${event.registrationEndDate}`,
    //   });
    // }

    return res.status(200).json(event);
  } catch (e) {
    console.error(e, 'Error getting event by id');
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: `please wait a moment and try again`,
    });
  }
}
