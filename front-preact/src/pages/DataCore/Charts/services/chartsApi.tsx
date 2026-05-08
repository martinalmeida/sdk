import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const chartsApi = {
  getCharts: () =>
    CoreApi.get<any[]>("/data-core/charts", { token: getToken() }),
  getChart: (id: number) =>
    CoreApi.get(`/data-core/charts/${id}`, { token: getToken() }),
  createChart: (data: any) =>
    CoreApi.post("/data-core/charts", data, { token: getToken() }),
  updateChart: (id: number, data: any) =>
    CoreApi.put(`/data-core/charts/${id}`, data, { token: getToken() }),
  deleteChart: (id: number) =>
    CoreApi.delete(`/data-core/charts/${id}`, { token: getToken() }),
  validateSql: (sql: string, chartTypeId: number, chartId?: number) => {
    const url = chartId
      ? `/data-core/charts/${chartId}/validate-sql`
      : "/data-core/charts/validate-sql";
    return CoreApi.post<{ valid: boolean }>(
      url,
      { sql_query: sql, chart_type_id: chartTypeId },
      { token: getToken() },
    );
  },
  executeChart: (chartId: number, filters?: any, params?: any) =>
    CoreApi.post(
      `/data-core/charts/${chartId}/execute`,
      { filters, params },
      { token: getToken() },
    ),
  getExecutionLogs: (params?: { start_date?: string; page?: number }) =>
    CoreApi.get<{
      data: any[];
      current_page: number;
      last_page: number;
      total: number;
    }>("/data-core/execution-logs", { params, token: getToken() }),
};
