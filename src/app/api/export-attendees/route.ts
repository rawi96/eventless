// pages/api/export-attendees.ts
import { getFullEventById } from '@/server/services/events-service';
import { parse } from 'json2csv';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  if (!eventId || typeof eventId !== 'string') {
    return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
  }

  try {
    // Fetch event and attendees from the database
    const event = await getFullEventById(eventId);

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 400 });
    }

    // Map attendees data to CSV format
    const csvData = event.attendees.map((attendee) => ({
      Email: attendee.email,
      'Registration Date': attendee.createdAt.toISOString(),
    }));

    // Convert data to CSV using json2csv
    const csv = parse(csvData);

    // Set headers for CSV download
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${event.title.replace(/ /g, '_')}_attendees.csv"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error exporting attendees:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
