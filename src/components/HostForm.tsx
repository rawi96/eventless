'use client';

import { checkScanner } from '@/server/actions/scanned-qr-code';
import { findAttendeeByHash, updateQrCodeStatus } from '@/server/services/events-service';
import { Attendee, CustomField, Event, Question } from '@prisma/client';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { revalidatePath, revalidateTag } from 'next/cache';
import { useEffect, useState } from 'react';

type Props = {
  event: Event & {
    customFields: CustomField[];
    questions: Question[];
    attendees: Attendee[];
  };
};

export default function EventForm({ event }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    if (scanning && !scanner) {
      const qrScanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: 250,
        },
        false,
      );

      qrScanner.render(
        (decodedText) => {
          handleScanSuccess(decodedText, qrScanner);
        },
        (error) => {
          console.warn('QR Code Scan Error:', error);
        },
      );

      setScanner(qrScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear();
        setScanner(null);
      }
    };
  }, [scanning]);

  // Handle successful QR code scans
  const handleScanSuccess = async (decodedText: string, qrScanner: Html5QrcodeScanner) => {
    if (!scanResult) {
      setScanResult(decodedText);
      setScanning(false);

      const result = await checkScanner(decodedText);
      console.log(result);
      // Stop the scanner after a successful scan
      qrScanner.clear();
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setScanning(!scanning);
          setScanResult(null);
        }}
        className={`${
          scanning ? 'bg-red-500' : 'bg-yellow-500'
        } rounded px-4 py-2 text-white hover:${scanning ? 'bg-red-600' : 'bg-yellow-600'}`}
      >
        {scanning ? 'Stop Scanning' : 'Start QR Scan'}
      </button>
      {/* QR Code Scanner Section */}
      {scanning && <div id="qr-reader" className="mb-6"></div>}

      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">Attendees</h2>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b p-2">Email</th>
              <th className="border-b p-2">Registration Date</th>
              <th className="border-b p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {event.attendees.map((attendee) => (
              <tr key={attendee.id} className={attendee.qrCodeScanned ? 'bg-green-100' : 'bg-red-100'}>
                <td className="border-b p-2">{attendee.email}</td>
                <td className="border-b p-2">{attendee.createdAt.toISOString()}</td>
                <td className="border-b p-2">{attendee.qrCodeScanned ? 'Seen' : 'Not Seen'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
