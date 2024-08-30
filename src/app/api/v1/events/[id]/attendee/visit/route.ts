import {
  createAttendee,
  existsAttandeeForEvent,
  findAttendeeByHash,
  getEventById,
  updateQrCodeStatus,
} from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/events/attendee/visit/{id}:
 *   post:
 *     summary: Validates a QR code hash and updates the attendee's status
 *     description: This endpoint validates a QR code hash for an attendee at a specific event and updates the QR code status if the attendee is found. It requires a valid API key for authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
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
 *         description: The hash of the QR code used for validation
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hash:
 *                   type: string
 *                   description: The hash associated with the QR code
 *                   example: 'abcdef1234567890'
 *     responses:
 *       200:
 *         description: Successfully validated the QR code and updated the attendee's status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Thanks for visiting us.
 *       400:
 *         description: Bad request due to event or attendee issues
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
 *                   example: Event with id {id} not found or You are not registered for this event
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
