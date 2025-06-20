import { createServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { z } from 'zod';
import type { PocketItem } from '../types/pocket';

interface FeedbinCredentials {
  email: string;
  password: string;
}

interface ImportStatus {
  status: 'idle' | 'importing' | 'completed' | 'error';
  currentIndex: number;
  total: number;
  error?: string;
  importedItems: PocketItem[];
}

const markAsRead = createServerFn()
  .validator(
    z.object({
      credentials: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
      entryId: z.number(),
    }),
  )
  .handler(async ({ data: { credentials, entryId } }) => {
    const response = await fetch(
      'https://api.feedbin.com/v2/unread_entries.json',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Basic ${btoa(`${credentials.email}:${credentials.password}`)}`,
        },
        body: JSON.stringify({
          unread_entries: [entryId],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to mark item as read: ${response.statusText}`);
    }
  });

const addToFeedbin = createServerFn()
  .validator(
    z.object({
      credentials: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
      item: z.object({
        url: z.string().url(),
        title: z.string().min(1),
        status: z.enum(['archive', 'unread']),
        tags: z.string().optional(),
      }),
    }),
  )
  .handler(async ({ data: { credentials, item } }) => {
    const response = await fetch('https://api.feedbin.com/v2/pages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${btoa(`${credentials.email}:${credentials.password}`)}`,
      },
      body: JSON.stringify({
        url: item.url,
        title: item.title,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to import item: ${response.statusText}`);
    }

    if (item.status === 'archive') {
      const { id: entryId } = await response.json();
      await markAsRead({ data: { credentials, entryId } });
    }
  });

export function useFeedbinImport() {
  const [credentials, setCredentials] = useState<FeedbinCredentials | null>(
    null,
  );
  const [showCredentialsPrompt, setShowCredentialsPrompt] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    status: 'idle',
    currentIndex: 0,
    total: 0,
    importedItems: [],
  });

  const openCredentialsPrompt = () => {
    setShowCredentialsPrompt(true);
  };

  const closeCredentialsPrompt = () => {
    setShowCredentialsPrompt(false);
  };

  const handleCredentialsSubmit = (email: string, password: string) => {
    setCredentials({ email, password });
    setShowCredentialsPrompt(false);
  };

  const importToFeedbin = async (items: PocketItem[]) => {
    if (!credentials) {
      openCredentialsPrompt();
      return;
    }

    setImportStatus({
      status: 'importing',
      currentIndex: 0,
      total: items.length,
      importedItems: [],
    });

    const importedItems: PocketItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      setImportStatus((prev) => ({
        ...prev,
        currentIndex: i,
      }));

      try {
        await addToFeedbin({ data: { credentials, item } });

        // Add the item to importedItems array
        importedItems.push(item);

        // Small delay to prevent overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update the status to show this item as imported immediately
        // Using the functional form of setState to avoid race conditions
        setImportStatus((prev) => ({
          ...prev,
          importedItems: [...prev.importedItems, item],
          currentIndex: -1,
        }));
      } catch (error) {
        console.error('Error importing to Feedbin:', error);
        setImportStatus({
          status: 'error',
          currentIndex: i,
          total: items.length,
          error: error instanceof Error ? error.message : 'Unknown error',
          importedItems,
        });
        return;
      }
    }

    setImportStatus({
      status: 'completed',
      currentIndex: items.length,
      total: items.length,
      importedItems,
    });
  };

  const resetImport = () => {
    setImportStatus({
      status: 'idle',
      currentIndex: 0,
      total: 0,
      importedItems: [],
    });
  };

  return {
    importToFeedbin,
    importStatus,
    resetImport,
    credentials,
    showCredentialsPrompt,
    openCredentialsPrompt,
    closeCredentialsPrompt,
    handleCredentialsSubmit,
  };
}
