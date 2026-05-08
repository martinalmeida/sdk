import { useState, useEffect } from "preact/hooks";
import { charts, chartsLoading, chartsError } from "../stores/chartsStore";
import { chartsApi } from "../services/chartsApi";
import { pushToast } from "../../../../tools/alerts";

export function useCharts() {
  const [loading, setLoading] = useState(true);

  const loadCharts = async () => {
    chartsLoading.value = true;
    const res = await chartsApi.getCharts();
    if (res.data) charts.value = res.data;
    else chartsError.value = res.error || "Error al cargar gráficas";
    chartsLoading.value = false;
  };

  const deleteChart = async (id: number) => {
    if (confirm("¿Eliminar esta gráfica?")) {
      const res = await chartsApi.deleteChart(id);
      if (!res.error) {
        await loadCharts();
        pushToast("Gráfica eliminada correctamente", "success");
      }
    }
  };

  useEffect(() => {
    loadCharts().finally(() => setLoading(false));
  }, []);

  return {
    charts: charts.value,
    loading: loading || chartsLoading.value,
    error: chartsError.value,
    deleteChart,
    refresh: loadCharts,
  };
}
