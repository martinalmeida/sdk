import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft, RefreshCw } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";
import { dashboardsApi } from "./services";
import { chartsApi } from "../Charts/services";
import { useChartTypes } from "../ChartTypes/hooks";
import { exportToCSV, exportToExcel } from "../../../tools/exports";
import ChartRendererComponent from "../Core/components/ChartRendererComponent";

interface Props {
  params?: Record<string, string>;
}

export default function DashboardView({ params }: Props) {
  const { route } = useLocation();
  const dashboardId = params?.id ? parseInt(params.id) : null;
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<Record<number, any>>({});
  const [refreshing, setRefreshing] = useState<Record<number, boolean>>({});
  const { chartTypes } = useChartTypes(); // Carga los tipos de gráfico
  const [chartTypeMap, setChartTypeMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (chartTypes.length) {
      const map: Record<number, string> = {};
      chartTypes.forEach((type) => {
        map[type.id] = type.name;
      });
      setChartTypeMap(map);
    }
  }, [chartTypes]);

  useEffect(() => {
    if (dashboardId) loadDashboard();
  }, [dashboardId]);

  const loadDashboard = async () => {
    setLoading(true);
    const res = await dashboardsApi.getDashboard(dashboardId!);
    if (res.data) {
      setDashboard(res.data);
      setPageTitle(res.data.name, "Visualización de datos");
      for (const dc of res.data.dashboard_charts || []) {
        await loadChartData(dc.id, dc.chart_id);
      }
    }
    setLoading(false);
  };

  const loadChartData = async (dashboardChartId: number, chartId: number) => {
    setRefreshing((prev) => ({ ...prev, [dashboardChartId]: true }));
    const res = await chartsApi.executeChart(chartId);
    if (res.data) {
      setChartData((prev) => ({ ...prev, [dashboardChartId]: res.data }));
    }
    setRefreshing((prev) => ({ ...prev, [dashboardChartId]: false }));
  };

  const refreshAll = async () => {
    if (!dashboard) return;
    for (const dc of dashboard.dashboard_charts || []) {
      await loadChartData(dc.id, dc.chart_id);
    }
  };

  if (loading) return <div class="p-6">Cargando tablero...</div>;
  if (!dashboard) return <div class="p-6">Tablero no encontrado</div>;

  return (
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <button
          onClick={() => route("/data-core/tableros")}
          class="inline-flex items-center gap-1 text-sm text-stone-500"
        >
          <ChevronLeft size={14} /> Volver a tableros
        </button>
        <button
          onClick={refreshAll}
          class="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-sm"
        >
          <RefreshCw size={14} /> Refrescar todo
        </button>
      </div>

      <div class="rounded-xl border border-stone-200 bg-white p-5">
        <h1 class="text-2xl font-bold">{dashboard.name}</h1>
        <p class="text-sm text-stone-500 mt-1">{dashboard.description}</p>

        <div class="mt-6 grid grid-cols-12 gap-4 auto-rows-min">
          {dashboard.dashboard_charts?.map((dc: any) => {
            const chartTypeId = dc.chart?.chart_type_id;
            const chartTypeName = chartTypeMap[chartTypeId] || "bar";
            const isTable = chartTypeName === "table";
            const chartInfo = chartData[dc.id];

            return (
              <div
                key={dc.id}
                class="col-span-12 rounded-lg border border-stone-200 bg-white p-3 shadow-sm"
                style={{ gridColumn: `span ${dc.width || 6}` }}
              >
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold">
                    {dc.chart?.name || `Gráfica ${dc.chart_id}`}
                  </h3>
                  <div class="flex gap-2">
                    {chartInfo && (
                      <>
                        <button
                          onClick={() =>
                            exportToCSV(
                              chartInfo.rows,
                              dc.chart?.name || "datos",
                            )
                          }
                          class="text-xs text-stone-500 hover:underline"
                        >
                          CSV
                        </button>
                        <button
                          onClick={() =>
                            exportToExcel(
                              chartInfo.rows,
                              dc.chart?.name || "datos",
                            )
                          }
                          class="text-xs text-stone-500 hover:underline"
                        >
                          Excel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => loadChartData(dc.id, dc.chart_id)}
                      class="text-xs text-blue-500"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>

                {refreshing[dc.id] && (
                  <div class="text-sm text-stone-400 mt-2">
                    Cargando datos...
                  </div>
                )}

                {!refreshing[dc.id] && chartInfo && (
                  <div class="mt-2">
                    {isTable ? (
                      <div class="overflow-x-auto">
                        <table class="min-w-full text-sm border">
                          <thead class="bg-stone-100">
                            <tr>
                              {chartInfo.columns?.map((col: string) => (
                                <th
                                  key={col}
                                  class="px-2 py-1 text-left border"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {chartInfo.rows?.map((row: any, idx: number) => (
                              <tr key={idx} class="border-t">
                                {chartInfo.columns.map((col: string) => (
                                  <td key={col} class="px-2 py-1">
                                    {row[col]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div class="text-[10px] text-stone-400 mt-1 text-right">
                          {chartInfo.execution_time_ms} ms
                        </div>
                      </div>
                    ) : (
                      <ChartRendererComponent
                        type={
                          chartTypeName === "kpi"
                            ? "bar"
                            : (chartTypeName as "bar" | "line" | "pie")
                        }
                        data={chartInfo.rows}
                        columns={chartInfo.columns}
                        xAxisColumn={dc.chart?.x_axis_column}
                        yAxisColumn={dc.chart?.y_axis_column}
                        seriesColumn={dc.chart?.series_column}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
