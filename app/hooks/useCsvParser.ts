import Papa from 'papaparse';
import { useCallback, useMemo } from 'react';
import type { ParsedData, PocketItem } from '../types/pocket';

interface UseCsvParserOptions {
  onParseStart: () => void;
  onParseComplete: (data: ParsedData) => void;
}

export function useCsvParser({
  onParseStart,
  onParseComplete,
}: UseCsvParserOptions) {
  const validateCSV = useMemo(
    () =>
      (
        data: Record<string, unknown>[],
      ): { isValid: boolean; error?: string } => {
        // Check if the data has at least one row
        if (!data || data.length === 0) {
          return { isValid: false, error: 'Empty CSV file' };
        }

        // Check if the CSV has the expected headers
        const requiredHeaders = [
          'title',
          'url',
          'time_added',
          'tags',
          'status',
        ];
        const firstRow = data[0];

        const hasAllHeaders = requiredHeaders.every((header) =>
          Object.keys(firstRow).includes(header),
        );

        if (!hasAllHeaders) {
          return {
            isValid: false,
            error:
              'CSV is missing required headers: title, url, time_added, tags, status',
          };
        }

        return { isValid: true };
      },
    [],
  );

  const parseFile = useCallback(
    (file: File) => {
      onParseStart();

      console.log('Processing file:', file.name, file.size);

      Papa.parse<PocketItem>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(
            'Parse complete, rows:',
            results.data.length,
            'errors:',
            results.errors.length,
          );

          const validation = validateCSV(results.data);
          console.log('Validation result:', validation);

          if (validation.isValid) {
            console.log(
              'Setting parsed data with',
              results.data.length,
              'items',
            );
            onParseComplete({
              data: results.data,
              error: null,
            });
          } else {
            console.log('Setting error:', validation.error);
            onParseComplete({
              data: [],
              error: validation.error || 'Invalid CSV format',
            });
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error.message);
          onParseComplete({
            data: [],
            error: `Error parsing CSV: ${error.message}`,
          });
        },
      });
    },
    [validateCSV, onParseStart, onParseComplete],
  );

  return { parseFile };
}
