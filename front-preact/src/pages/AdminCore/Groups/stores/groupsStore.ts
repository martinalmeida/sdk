import { signal } from "@preact/signals";

export interface Group {
  id: number;
  name: string;
  description: string | null;
  users?: any[];
}

export const groups = signal<Group[]>([]);
export const groupsLoading = signal(false);
export const groupsError = signal<string | null>(null);
