import { getEventsWhereRegistrationIsPossible } from '@/server/services/events-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieves events where registration is possible
 *     description: This endpoint returns a list of events where registration is possible. It requires a valid API key for authorization.
 *     parameters:
 *       - in: header
 *         name: api-key
 *         required: true
 *         description: API key for authorization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
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
  const decodedBearerToken = validateAuthorizationHeader(req.headers.get('api-key'));
  if (!decodedBearerToken) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: `Your API Key is invalid.` }, { status: 401 });
  }

  try {
    const events = await getEventsWhereRegistrationIsPossible();
    return NextResponse.json(events, { status: 200 });
  } catch (e) {
    console.error(e, 'Error getting events');
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: `please wait a moment and try again`,
      },
      { status: 500 },
    );
  }
}
