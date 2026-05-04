import { signal } from "@preact/signals";

export const positions = signal<any[]>([]);
export const positionsLoading = signal(false);
export const positionsError = signal<string | null>(null);
