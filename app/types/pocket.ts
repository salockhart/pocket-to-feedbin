// Represents a single Pocket bookmark entry from the CSV export
export interface PocketItem {
  title: string;
  url: string;
  time_added: string;
  tags: string;
  status: string;
}

// Represents the parsed CSV data
export interface ParsedData {
  data: PocketItem[];
  error: string | null;
}
