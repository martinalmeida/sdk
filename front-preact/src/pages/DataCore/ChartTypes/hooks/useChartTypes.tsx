import { useState, useEffect } from "preact/hooks";
import {
  chartTypes,
  chartTypesLoading,
  chartTypesError,
} from "../stores/chartTypesStore";
import { chartTypesApi } from "../services";

export function useChartTypes() {
  const [loading, setLoading] = useState(true);

  const loadChartTypes = async () => {
    chartTypesLoading.value = true;
    const res = await chartTypesApi.getChartTypes();
    if (res.data) chartTypes.value = res.data;
    else
      chartTypesError.value = res.error || "Error al cargar tipos de gráfico";
    chartTypesLoading.value = false;
  };

  useEffect(() => {
    loadChartTypes().finally(() => setLoading(false));
  }, []);

  return {
    chartTypes: chartTypes.value,
    loading: loading || chartTypesLoading.value,
    error: chartTypesError.value,
  };
}
