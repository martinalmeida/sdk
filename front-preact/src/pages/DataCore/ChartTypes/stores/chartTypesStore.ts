import { signal } from "@preact/signals";

export interface ChartType {
  id: number;
  name: string;
  label: string;
  description: string | null;
  icon: string | null;
  supports_multiple_series: boolean;
  requires_category_axis: boolean;
  requires_value_axis: boolean;
  is_active: boolean;
  rules?: any[];
  filters?: any[];
}

export const chartTypes = signal<ChartType[]>([]);
export const chartTypesLoading = signal(false);
export const chartTypesError = signal<string | null>(null);
