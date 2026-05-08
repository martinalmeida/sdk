import { signal } from "@preact/signals";

export interface Dashboard {
  id: number;
  name: string;
  description: string | null;
  status: string;
  is_public: boolean;
  layout_config?: any;
  charts?: any[];
}

export const dashboards = signal<Dashboard[]>([]);
export const dashboardsLoading = signal(false);
export const dashboardsError = signal<string | null>(null);
