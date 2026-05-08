import { signal } from "@preact/signals";

export interface Position {
  id: number;
  name: string;
  description: string | null;
}

export const positions = signal<Position[]>([]);
export const positionsLoading = signal(false);
export const positionsError = signal<string | null>(null);
