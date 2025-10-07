'use client';

import { useState, ChangeEvent } from 'react';
import Papa from 'papaparse';

interface DataUploadProps {
  onDataUpload: (data: Record<string, unknown>[]) => void;
}

export default function DataUpload({ onDataUpload }: DataUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setError('');

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          onDataUpload(results.data as Record<string, unknown>[]);
          setUploading(false);
        },
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setUploading(false);
        },
      });
    } else if (fileExtension === 'json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          onDataUpload(Array.isArray(json) ? json : [json]);
          setUploading(false);
        } catch {
          setError('Error parsing JSON file');
          setUploading(false);
        }
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a CSV or JSON file');
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>Upload CSV or JSON</span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept=".csv,.json"
          className="sr-only"
          onChange={handleFileUpload}
          aria-label="Upload climate data file"
        />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          {uploading ? 'Uploading...' : `Uploaded: ${fileName}`}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Upload your own climate data in CSV or JSON format
      </p>
    </div>
  );
}
