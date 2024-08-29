'use client';
import { useState } from 'react';

type Props = {
  id: string;
  title: string;
};

export default function ExportToCsv({ id, title }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  // Handle CSV export by calling the backend API
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Call the API to export attendees
      const response = await fetch(`/api/export-attendees?eventId=${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export attendees');
      }

      // Get the CSV content and create a download link
      const csv = await response.text();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/ /g, '_')}_attendees.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting attendees:', error);
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
    >
      {isExporting ? 'Exporting...' : 'Export to CSV'}
    </button>
  );
}
