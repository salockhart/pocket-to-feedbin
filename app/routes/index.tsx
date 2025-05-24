import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [fileHover, setFileHover] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the file upload here
    console.log('Accepted files:', acceptedFiles);

    // You can process CSV files here
    const file = acceptedFiles[0];
    if (file) {
      // Process the CSV file
      console.log('Processing file:', file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        {...getRootProps()}
        className={`
          w-[70vw] h-[70vh] flex flex-col items-center justify-center
          border-4 border-dashed rounded-2xl p-6 text-center 
          transition-colors duration-200 cursor-pointer
          ${
            isDragActive || fileHover
              ? 'border-blue-600 bg-blue-100'
              : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
          }
        `}
        onMouseEnter={() => setFileHover(true)}
        onMouseLeave={() => setFileHover(false)}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon
          className={`w-12 h-12 mb-3 ${isDragActive ? 'text-blue-600' : 'text-blue-500'}`}
        />
        <p
          className={`text-lg font-medium ${isDragActive ? 'text-blue-700' : 'text-blue-600'}`}
        >
          Drop CSV file here
        </p>
        <p className="text-sm text-blue-500 mt-1">or click to select file</p>
        <p className="text-xs text-blue-400 mt-3">
          Only CSV files are accepted
        </p>
      </div>
    </div>
  );
}
