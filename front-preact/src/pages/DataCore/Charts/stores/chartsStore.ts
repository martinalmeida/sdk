import { signal } from "@preact/signals";

export interface Chart {
  id: number;
  name: string;
  description: string | null;
  chart_type_id: number;
  sql_query: string;
  x_axis_column: string | null;
  y_axis_column: string | null;
  series_column: string | null;
  label_column: string | null;
  style_config: any;
  extra_config: any;
  status: "draft" | "validated" | "published" | "deprecated";
  is_public: boolean;
  chart_type?: any;
}

export const charts = signal<Chart[]>([]);
export const chartsLoading = signal(false);
export const chartsError = signal<string | null>(null);
