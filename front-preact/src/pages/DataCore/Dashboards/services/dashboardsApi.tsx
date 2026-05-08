import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export interface DashboardData {
  id: number;
  name: string;
  description: string | null;
  status: string;
  is_public: boolean;
  layout_config?: any;
  //Relaciones:
  dashboard_charts?: Array<{
    id: number;
    dashboard_id: number;
    chart_id: number;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    sort_order: number;
    override_config: any;
    created_at: string;
    updated_at: string;
    chart?: {
      id: number;
      name: string;
    };
  }>;
  users?: Array<any>;
  groups?: Array<any>;
}

export const dashboardsApi = {
  getDashboards: () =>
    CoreApi.get<DashboardData[]>("/data-core/dashboards", {
      token: getToken(),
    }),
  getDashboard: (id: number) =>
    CoreApi.get<DashboardData>(`/data-core/dashboards/${id}`, {
      token: getToken(),
    }),
  createDashboard: (data: any) =>
    CoreApi.post<DashboardData>("/data-core/dashboards", data, {
      token: getToken(),
    }),
  updateDashboard: (id: number, data: any) =>
    CoreApi.put<DashboardData>(`/data-core/dashboards/${id}`, data, {
      token: getToken(),
    }),
  deleteDashboard: (id: number) =>
    CoreApi.delete<{ message: string }>(`/data-core/dashboards/${id}`, {
      token: getToken(),
    }),
  addChart: (dashboardId: number, chartId: number, position: any) =>
    CoreApi.post(
      `/data-core/dashboards/${dashboardId}/charts`,
      { chart_id: chartId, ...position },
      { token: getToken() },
    ),
  removeChart: (dashboardId: number, dashboardChartId: number) =>
    CoreApi.delete(
      `/data-core/dashboards/${dashboardId}/charts/${dashboardChartId}`,
      { token: getToken() },
    ),
  updateChartPosition: (
    dashboardId: number,
    dashboardChartId: number,
    position: any,
  ) =>
    CoreApi.put(
      `/data-core/dashboards/${dashboardId}/charts/${dashboardChartId}`,
      position,
      { token: getToken() },
    ),
};
