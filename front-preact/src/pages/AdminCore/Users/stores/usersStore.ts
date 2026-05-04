import { signal } from "@preact/signals";

export interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  position: { id: number; name: string } | null;
  programs: any[];
  permissions: any[];
}

export const users = signal<User[]>([]);
export const usersPagination = signal({
  current_page: 1,
  last_page: 1,
  total: 0,
});
export const usersLoading = signal(false);
export const usersError = signal<string | null>(null);
