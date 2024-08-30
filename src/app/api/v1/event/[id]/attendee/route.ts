import { createAttendee, existsAttandeeForEvent, getEventById } from '@/server/services/events-service';
import { Attendee } from '@prisma/client';
import { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

type ErrorMessage = {
  code: string;
  message: string;
};

type ResponseData = Attendee | ErrorMessage;

type Registration = {
  email: string;
  answers: Answer[];
};
type Answer = {
  questionId: string;
  answerText: string;
};

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

export async function POST(req: NextRequest, res: NextApiResponse<ResponseData>, context: { params: { id: string } }) {
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('Authorization'));
  if (!decodedBearerToken) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: `Your API Key is invalid.` });
  }

  try {
    const event = await getEventById(context.params.id);
    if (!event) {
      return res.status(400).json({ code: 'NOT_FOUND', message: `Event with id ${context.params.id} not found` });
    }

    if (event.registrationEndDate && event.registrationEndDate < new Date()) {
      return res.status(401).json({
        code: 'REGISTRATION_EXCEEDED',
        message: `Registration is not possible anymore. deadline ended on ${event.registrationEndDate}`,
      });
    }

    const registration = (await req.json()) as Registration;

    const existingAttendee = await existsAttandeeForEvent(event.id, registration.email);
    if (existingAttendee) {
      return res.status(400).json({ code: 'ALREADY_REGISTERED', message: `You are already registered for this event` });
    }

    const answeredRequiredQuestions = event.questions
      .filter((question) => question.isRequired)
      .every((question) => registration.answers.some((answer) => answer.questionId === question.id));

    if (!answeredRequiredQuestions) {
      return res.status(400).json({ code: 'MISSING_REQUIRED_ANSWERS', message: `Please answer all required questions` });
    }

    // create attandee
    const attendee = await createAttendee(event.id, registration.email, registration.answers);

    return res.status(200).json(attendee);
  } catch (e) {
    console.error(e, 'Error getting event by id');
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: `please wait a moment and try again`,
    });
  }
}
