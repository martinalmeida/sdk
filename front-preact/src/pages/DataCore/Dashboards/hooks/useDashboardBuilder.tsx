import { useState, useEffect } from "preact/hooks";
import { dashboardsApi } from "../services/dashboardsApi";
import { chartsApi } from "../../Charts/services";
import { pushToast } from "../../../../tools/alerts";

export function useDashboardBuilder(
  dashboardId: number,
  onSuccess: () => void,
) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableCharts, setAvailableCharts] = useState<any[]>([]);

  const loadDashboard = async () => {
    const res = await dashboardsApi.getDashboard(dashboardId);
    if (res.data) setDashboard(res.data);
  };

  const loadCharts = async () => {
    const res = await chartsApi.getCharts();
    if (res.data) setCharts(res.data);
  };

  useEffect(() => {
    Promise.all([loadDashboard(), loadCharts()]).finally(() =>
      setLoading(false),
    );
  }, [dashboardId]);

  useEffect(() => {
    if (dashboard && charts.length) {
      const existingIds =
        dashboard.dashboard_charts?.map((dc: any) => dc.chart_id) || [];
      setAvailableCharts(charts.filter((c) => !existingIds.includes(c.id)));
    }
  }, [dashboard, charts]);

  const addChartToDashboard = async (
    chartId: number,
    position: any = { position_x: 0, position_y: 0, width: 6, height: 4 },
  ) => {
    const res = await dashboardsApi.addChart(dashboardId, chartId, position);
    if (!res.error) {
      await loadDashboard();
      pushToast("Gráfica añadida al tablero", "success");
    }
  };

  const removeChartFromDashboard = async (dashboardChartId: number) => {
    if (confirm("¿Quitar esta gráfica del tablero?")) {
      const res = await dashboardsApi.removeChart(
        dashboardId,
        dashboardChartId,
      );
      if (!res.error) {
        await loadDashboard();
        pushToast("Gráfica eliminada del tablero", "success");
      }
    }
  };

  const updateChartPosition = async (
    dashboardChartId: number,
    position: any,
  ) => {
    const res = await dashboardsApi.updateChartPosition(
      dashboardId,
      dashboardChartId,
      position,
    );
    if (!res.error) await loadDashboard();
  };

  const saveLayout = async (layout: any) => {
    setSaving(true);
    const res = await dashboardsApi.updateDashboard(dashboardId, {
      layout_config: layout,
    });
    if (!res.error) {
      pushToast("Tablero guardado correctamente", "success");
      onSuccess();
    }
    setSaving(false);
  };

  return {
    dashboard,
    availableCharts,
    loading,
    saving,
    addChartToDashboard,
    removeChartFromDashboard,
    updateChartPosition,
    saveLayout,
  };
}
