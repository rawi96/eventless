import { createAttendee, existsAttandeeForEvent, getEventById } from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';
/**
 * @swagger
 * /api/events/{id}/attendee:
 *   post:
 *     summary: Registers an attendee for an event with answers to required questions
 *     description: This endpoint registers an attendee for a specific event. It checks if the event exists, if registration is still open, if the attendee is already registered, and if all required questions have been answered. It requires a valid API key for authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to register for
 *         schema:
 *           type: string
 *       - in: header
 *         name: api-key
 *         required: true
 *         description: API key for authorization
 *         schema:
 *           type: string
 *       - in: body
 *         name: Registration
 *         description: The registration details including email and answers to required questions
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: The email address of the attendee
 *                   example: 'attendee@example.com'
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: string
 *                         description: The ID of the question
 *                         example: 'q1'
 *                       answerText:
 *                         type: string
 *                         description: The answer text for the question
 *                         example: 'Yes'
 *     responses:
 *       200:
 *         description: Successfully registered the attendee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created attendee
 *                   example: 'attendee123'
 *                 email:
 *                   type: string
 *                   description: The email address of the registered attendee
 *                   example: 'attendee@example.com'
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: string
 *                         description: The ID of the question
 *                         example: 'q1'
 *                       answerText:
 *                         type: string
 *                         description: The answer text for the question
 *                         example: 'Yes'
 *       400:
 *         description: Bad request due to issues such as event not found, registration deadline exceeded, already registered, or missing required answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Event with id {id} not found or Registration is not possible anymore. deadline ended on {registrationEndDate}
 *       401:
 *         description: Unauthorized, invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: UNAUTHORIZED
 *                 message:
 *                   type: string
 *                   example: Your API Key is invalid.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 *                 message:
 *                   type: string
 *                   example: please wait a moment and try again
 */

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

    if (event.registrationEndDate && event.registrationEndDate < new Date()) {
      return NextResponse.json(
        {
          code: 'REGISTRATION_EXCEEDED',
          message: `Registration is not possible anymore. deadline ended on ${event.registrationEndDate}`,
        },
        { status: 400 },
      );
    }

    const registration = (await req.json()) as Registration;

    const existingAttendee = await existsAttandeeForEvent(event.id, registration.email);
    if (existingAttendee) {
      return NextResponse.json(
        { code: 'ALREADY_REGISTERED', message: `You are already registered for this event` },
        { status: 400 },
      );
    }

    const answeredRequiredQuestions = event.questions
      .filter((question) => question.isRequired)
      .every((question) => registration.answers.some((answer) => answer.questionId === question.id));

    if (!answeredRequiredQuestions) {
      return NextResponse.json(
        { code: 'MISSING_REQUIRED_ANSWERS', message: `Please answer all required questions` },
        { status: 400 },
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
      { status: 500 },
    );
  }
}
