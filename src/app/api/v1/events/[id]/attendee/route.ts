import { createAttendee, existsAttandeeForEvent, getEventById } from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
};

type Registration = {
  email: string;
  answers: Answer[];
};
type Answer = {
  questionId: string;
  answerText: string;
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
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('Authorization'));
  if (!decodedBearerToken) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: `Your API Key is invalid.` },
      { status: 401, headers: CORS_HEADERS },
    );
  }

  try {
    const event = await getEventById(context.params.id);
    if (!event) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: `Event with id ${context.params.id} not found` },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    if (event.registrationEndDate && event.registrationEndDate < new Date()) {
      return NextResponse.json(
        {
          code: 'REGISTRATION_EXCEEDED',
          message: `Registration is not possible anymore. deadline ended on ${event.registrationEndDate}`,
        },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const registration = (await req.json()) as Registration;

    const existingAttendee = await existsAttandeeForEvent(event.id, registration.email);
    if (existingAttendee) {
      return NextResponse.json(
        { code: 'ALREADY_REGISTERED', message: `You are already registered for this event` },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const answeredRequiredQuestions = event.questions
      .filter((question) => question.isRequired)
      .every((question) => registration.answers.some((answer) => answer.questionId === question.id));

    if (!answeredRequiredQuestions) {
      return NextResponse.json(
        { code: 'MISSING_REQUIRED_ANSWERS', message: `Please answer all required questions` },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    // create attandee
    const attendee = await createAttendee(event.id, registration.email, registration.answers);

    return NextResponse.json(attendee, { status: 200 });
  } catch (e) {
    console.error(e, 'Error getting event by id');
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: `please wait a moment and try again`,
      },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
