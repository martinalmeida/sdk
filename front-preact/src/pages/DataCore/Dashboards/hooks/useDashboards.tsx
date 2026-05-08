import { useState, useEffect } from "preact/hooks";
import {
  dashboards,
  dashboardsLoading,
  dashboardsError,
} from "../stores/dashboardsStore";
import { dashboardsApi } from "../services";
import { pushToast } from "../../../../tools/alerts";

export function useDashboards() {
  const [loading, setLoading] = useState(true);

  const loadDashboards = async () => {
    dashboardsLoading.value = true;
    const res = await dashboardsApi.getDashboards();
    if (res.data) dashboards.value = res.data;
    else dashboardsError.value = res.error || "Error al cargar tableros";
    dashboardsLoading.value = false;
  };

  const deleteDashboard = async (id: number) => {
    if (confirm("¿Eliminar este tablero?")) {
      const res = await dashboardsApi.deleteDashboard(id);
      if (!res.error) {
        await loadDashboards();
        pushToast("Tablero eliminado correctamente", "success");
      }
    }
  };

  useEffect(() => {
    loadDashboards().finally(() => setLoading(false));
  }, []);

  return {
    dashboards: dashboards.value,
    loading: loading || dashboardsLoading.value,
    error: dashboardsError.value,
    deleteDashboard,
    refresh: loadDashboards,
  };
}
