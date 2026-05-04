import { signal } from "@preact/signals";

export const programs = signal<any[]>([]);
export const programsLoading = signal(false);
export const programsError = signal<string | null>(null);