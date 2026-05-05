import { signal } from "@preact/signals";

export interface Program {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  version: string;
  is_active: boolean;
}

export const programs = signal<Program[]>([]);
export const programsLoading = signal(false);
export const programsError = signal<string | null>(null);
