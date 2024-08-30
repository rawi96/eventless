import { existsAttandeeForEvent, getEventById, updateAttendeeWithHash } from '@/server/services/events-service';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

/**
 * @swagger
 * /api/v1/events/{id}/attendee/{email}/qrcode:
 *   get:
 *     summary: Generates a PDF with event details and a QR code for a registered attendee
 *     description: This endpoint generates a PDF containing event details and a QR code for an attendee who is registered for the event. The QR code is created using a hash that includes the event ID, attendee email, and attendee ID. It requires a valid API key for authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *       - in: path
 *         name: email
 *         required: true
 *         description: The email address of the attendee
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
 *         description: Successfully generated PDF with event details and QR code
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
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
  email: string;
};

function generateHash(eventId: string, email: string, id: string): string {
  // Concatenate the input values
  const dataToHash = `${eventId}-${email}-${id}`;

  // Create a SHA-256 hash
  const hash = createHash('sha256').update(dataToHash).digest('hex'); // Output as a hex string

  return hash;
}

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

export async function GET(req: NextRequest, context: { params: { id: string; email: string } }) {
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

    const existingAttendee = await existsAttandeeForEvent(event.id, context.params.email);
    if (!existingAttendee) {
      return NextResponse.json(
        { code: 'NOT_REGISTERED', message: `You are not registered for this event` },
        { status: 400 },
      );
    }
    const hash = generateHash(event.id, context.params.email, existingAttendee.id);
    await updateAttendeeWithHash(existingAttendee.id, hash);

    // Generate QR code with event URL or ID
    const qrCodeDataURL = await QRCode.toDataURL(hash);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 14;

    // Add event title
    page.drawText(`Event: ${event.title}`, {
      x: 50,
      y: 350,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Add event description
    if (event.description) {
      page.drawText(`Description: ${event.description}`, {
        x: 50,
        y: 320,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // Add event date
    if (event.eventDate) {
      page.drawText(`Date: ${new Date(event.eventDate).toLocaleDateString()}`, {
        x: 50,
        y: 290,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // Add QR code to PDF
    const qrImage = await pdfDoc.embedPng(qrCodeDataURL);
    page.drawImage(qrImage, {
      x: 50,
      y: 100,
      width: 150,
      height: 150,
    });

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Set headers for PDF download
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${event.title.replace(/ /g, '_')}_info.pdf"`,
      },
      status: 200,
    });
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
