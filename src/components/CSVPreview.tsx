import React from 'react';
import { Table2 } from 'lucide-react';

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface CSVPreviewProps {
  data: CSVData;
}

function CSVPreview({ data }: CSVPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Table2 className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-600">
          Showing first {Math.min(10, data.rows.length)} rows of {data.rows.length} total rows
        </span>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {data.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.rows.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.rows.length > 10 && (
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            ... and {data.rows.length - 10} more rows
          </p>
        </div>
      )}
    </div>
  );
}

export default CSVPreview;