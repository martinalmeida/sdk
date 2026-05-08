import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft, Play, Loader } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";
import { chartsApi } from "./services";
import { exportToCSV, exportToExcel } from "../../../tools/exports";
import ChartRendererComponent from "../Core/components/ChartRendererComponent";

interface Props {
  params?: Record<string, string>;
}

export default function ChartPreview({ params }: Props) {
  const chartId = params?.id ? parseInt(params.id) : null;
  const { route } = useLocation();
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    if (chartId) loadChart();
  }, [chartId]);

  const loadChart = async () => {
    setLoading(true);
    const res = await chartsApi.getChart(chartId!);
    if (res.data) setChart(res.data);
    setLoading(false);
  };

  const execute = async () => {
    setExecuting(true);
    const res = await chartsApi.executeChart(chartId!, filters);
    if (res.data) setResultData(res.data);
    setExecuting(false);
  };

  useEffect(() => {
    if (chart)
      setPageTitle(`Vista previa: ${chart.name}`, "Ejecución con filtros");
  }, [chart]);

  if (loading) return <div class="p-6">Cargando...</div>;
  if (!chart) return <div class="p-6">Gráfica no encontrada</div>;

  const isTable = chart.chart_type?.name === "table";

  return (
    <div class="p-6">
      <button
        onClick={() => route("/data-core/graficas")}
        class="mb-4 inline-flex items-center gap-1 text-sm text-stone-500"
      >
        <ChevronLeft size={14} /> Volver a gráficas
      </button>

      <div class="rounded-xl border border-stone-200 bg-white p-4">
        <h2 class="text-xl font-bold">{chart.name}</h2>
        <p class="text-sm text-stone-500">{chart.description}</p>

        {/* Filtros */}
        <div class="mt-4 border-t pt-4">
          <h3 class="font-semibold mb-2">Filtros</h3>
          {chart.chart_type?.filters?.length > 0 ? (
            <div class="flex gap-4 flex-wrap">
              {chart.chart_type.filters.map((filter: any) => (
                <div key={filter.id}>
                  <label class="block text-xs font-semibold uppercase mb-1">
                    {filter.label}
                  </label>
                  {filter.input_type === "date_range" && (
                    <div class="flex gap-2">
                      <input
                        type="date"
                        class="border rounded px-2 py-1 text-sm"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            [`${filter.sql_placeholder}_from`]: (
                              e.target as HTMLInputElement
                            ).value,
                          })
                        }
                      />
                      <input
                        type="date"
                        class="border rounded px-2 py-1 text-sm"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            [`${filter.sql_placeholder}_to`]: (
                              e.target as HTMLInputElement
                            ).value,
                          })
                        }
                      />
                    </div>
                  )}
                  {filter.input_type === "text" && (
                    <input
                      type="text"
                      class="border rounded px-2 py-1 text-sm"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [filter.sql_placeholder]: (
                            e.target as HTMLInputElement
                          ).value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p class="text-xs text-stone-400">No hay filtros configurables</p>
          )}
          <div class="mt-4 flex gap-3 items-center">
            <button
              onClick={execute}
              class="inline-flex items-center gap-2 rounded-md bg-[#7c3aed] px-3 py-1.5 text-sm text-white"
            >
              {executing ? (
                <Loader size={14} class="animate-spin" />
              ) : (
                <Play size={14} />
              )}
              Ejecutar
            </button>
            {resultData && (
              <>
                <button
                  onClick={() => exportToCSV(resultData.rows, chart.name)}
                  class="text-sm text-stone-600 hover:underline"
                >
                  CSV
                </button>
                <button
                  onClick={() => exportToExcel(resultData.rows, chart.name)}
                  class="text-sm text-stone-600 hover:underline"
                >
                  Excel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Resultados */}
        {resultData && (
          <div class="mt-4 border-t pt-4">
            <h3 class="font-semibold mb-2">
              Resultados ({resultData.rows?.length || 0} filas,{" "}
              {resultData.execution_time_ms} ms)
            </h3>
            {isTable ? (
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm border">
                  <thead class="bg-stone-100">
                    <tr>
                      {resultData.columns.map((col: string) => (
                        <th key={col} class="px-2 py-1 text-left border">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultData.rows.map((row: any, idx: number) => (
                      <tr key={idx} class="border-t">
                        {resultData.columns.map((col: string) => (
                          <td key={col} class="px-2 py-1">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ChartRendererComponent
                type={chart.chart_type?.name}
                data={resultData.rows}
                columns={resultData.columns}
                xAxisColumn={chart.x_axis_column}
                yAxisColumn={chart.y_axis_column}
                seriesColumn={chart.series_column}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
