import { getEventById } from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Retrieves details of an event by ID
 *     description: This endpoint retrieves detailed information about a specific event by its ID. It requires a valid API key for authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to retrieve
 *         schema:
 *           type: string
 *       - in: header
 *         name: api-key
 *         required: true
 *         description: API key for authorization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the event
 *                   example: 'event123'
 *                 title:
 *                   type: string
 *                   description: The title of the event
 *                   example: 'Annual Conference'
 *                 description:
 *                   type: string
 *                   description: A description of the event
 *                   example: 'A conference to discuss annual goals and strategies.'
 *                 eventDate:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time of the event
 *                   example: '2024-09-15T09:00:00Z'
 *                 registrationEndDate:
 *                   type: string
 *                   format: date-time
 *                   description: The deadline for registration
 *                   example: '2024-09-10T23:59:59Z'
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the question
 *                         example: 'q1'
 *                       text:
 *                         type: string
 *                         description: The text of the question
 *                         example: 'What is your level of experience?'
 *                       isRequired:
 *                         type: boolean
 *                         description: Whether the question is required
 *                         example: true
 *       400:
 *         description: Bad request, event not found
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
 *                   example: Event with id {id} not found
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
