import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { BookmarkList } from '../components/BookmarkList';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { FileUploadArea } from '../components/FileUploadArea';
import { ProcessingIndicator } from '../components/ProcessingIndicator';
import { useCsvParser } from '../hooks/useCsvParser';
import type { ParsedData } from '../types/pocket';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [parsedData, setParsedData] = useState<ParsedData>({
    data: [],
    error: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const resetData = () => {
    setParsedData({ data: [], error: null });
  };

  const handleParseStart = useCallback(() => {
    setIsProcessing(true);
    setParsedData({ data: [], error: null });
  }, []);

  const handleParseComplete = useCallback((data: ParsedData) => {
    setParsedData(data);
    setIsProcessing(false);
  }, []);

  const { parseFile } = useCsvParser({
    onParseStart: handleParseStart,
    onParseComplete: handleParseComplete,
  });

  const handleFileDrop = useCallback(
    (file: File) => {
      parseFile(file);
    },
    [parseFile],
  );

  // Render the UI
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* If we have data and no errors, show the BookmarkList component */}
      {parsedData.data.length > 0 && !parsedData.error ? (
        <div className="w-full h-[90vh] p-4">
          <BookmarkList items={parsedData.data} onReset={resetData} />
        </div>
      ) : (
        <div
          className={`
            w-[70vw] h-[70vh] flex flex-col items-center justify-center
            ${isProcessing ? 'cursor-wait' : ''}
            ${parsedData.error ? 'border-red-400' : ''}
          `}
        >
          {isProcessing ? (
            <ProcessingIndicator />
          ) : parsedData.error ? (
            <ErrorDisplay
              errorMessage={parsedData.error}
              onReset={(e) => {
                e.stopPropagation();
                resetData();
              }}
            />
          ) : (
            <FileUploadArea
              onFileDrop={handleFileDrop}
              isProcessing={isProcessing}
              hasError={!!parsedData.error}
            />
          )}
        </div>
      )}
    </div>
  );
}
