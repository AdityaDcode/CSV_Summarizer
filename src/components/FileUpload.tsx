import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Papa from 'papaparse';

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface FileUploadProps {
  onFileUpload: (data: CSVData) => void;
}

function FileUpload({ onFileUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setError(null);

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please upload a file smaller than 5MB.');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setError('Error parsing CSV file. Please check the file format.');
          console.error('CSV parsing errors:', results.errors);
        } else {
          const headers = results.meta.fields || [];
          const rows = results.data as any[];
          const stringRows = rows.map(row => headers.map(header => row[header]));
          onFileUpload({ headers, rows: stringRows });
        }
        setIsProcessing(false);
      },
      error: (err) => {
        setError('An unexpected error occurred while parsing the file.');
        console.error('PapaParse error:', err);
        setIsProcessing(false);
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragOver ? 'Drop your CSV file here' : 'Upload CSV File'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your CSV file here, or click to browse
          </p>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {isProcessing && (
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-green-700">Processing file...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;