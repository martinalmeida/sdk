import { signal } from "@preact/signals";

export interface Role {
  id: number;
  name: string;
  label: string;
  description: string | null;
  is_global: boolean;
  program_id: number | null;
  program?: { id: number; name: string };
}

export const roles = signal<Role[]>([]);
export const rolesLoading = signal(false);
export const rolesError = signal<string | null>(null);
