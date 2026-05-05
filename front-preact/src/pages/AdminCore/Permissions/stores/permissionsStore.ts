import { signal } from "@preact/signals";

export interface Permission {
  id: number;
  name: string;
  label: string;
  group: string;
  program_id: number | null;
  program?: { id: number; name: string } | null;
}

export const permissions = signal<Permission[]>([]);
export const permissionsLoading = signal(false);
export const permissionsError = signal<string | null>(null);
