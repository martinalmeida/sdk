import { signal } from "@preact/signals";

export const roles = signal<any[]>([]);
export const rolesLoading = signal(false);
export const rolesError = signal<string | null>(null);
