import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft, Plus, Trash2, Move, Save, Loader } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";
import { useDashboardBuilder } from "./hooks";
import { chartsApi } from "../Charts/services";

interface Props {
  params?: Record<string, string>;
}

export default function DashboardBuilder({ params }: Props) {
  const dashboardId = params?.id ? parseInt(params.id) : null;
  const { route } = useLocation();
  const {
    dashboard,
    availableCharts,
    loading,
    saving,
    addChartToDashboard,
    removeChartFromDashboard,
    updateChartPosition,
    saveLayout,
  } = useDashboardBuilder(dashboardId!, () => route("/data-core/tableros"));

  const [editingChartId, setEditingChartId] = useState<number | null>(null);
  const [tempPosition, setTempPosition] = useState({
    position_x: 0,
    position_y: 0,
    width: 6,
    height: 4,
  });
  const [previewData, setPreviewData] = useState<Record<number, any>>({});
  const [previewLoading, setPreviewLoading] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    if (dashboard)
      setPageTitle(
        `Constructor: ${dashboard.name}`,
        "Arrastra y configura gráficas",
      );
  }, [dashboard]);

  const loadPreview = async (chartId: number, dashboardChartId: number) => {
    setPreviewLoading((prev) => ({ ...prev, [dashboardChartId]: true }));
    const res = await chartsApi.executeChart(chartId);
    if (res.data) {
      setPreviewData((prev) => ({ ...prev, [dashboardChartId]: res.data }));
    }
    setPreviewLoading((prev) => ({ ...prev, [dashboardChartId]: false }));
  };

  const handleAddChart = async (chartId: number) => {
    await addChartToDashboard(chartId);
    setEditingChartId(null);
  };

  const handleUpdatePosition = async (dashboardChartId: number) => {
    await updateChartPosition(dashboardChartId, tempPosition);
    setEditingChartId(null);
  };

  if (loading) return <div class="p-6">Cargando...</div>;
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
          onClick={saveLayout}
          disabled={saving}
          class="inline-flex items-center gap-2 rounded-md bg-[#7c3aed] px-3 py-1.5 text-sm text-white"
        >
          {saving ? (
            <Loader size={14} class="animate-spin" />
          ) : (
            <Save size={14} />
          )}{" "}
          Guardar layout
        </button>
      </div>

      <div class="flex gap-6">
        {/* Lista de gráficas disponibles */}
        <div class="w-64 shrink-0 rounded-xl border border-stone-200 bg-white p-3">
          <h3 class="font-semibold mb-2">Gráficas disponibles</h3>
          <div class="space-y-2">
            {availableCharts.map((chart) => (
              <div
                key={chart.id}
                class="flex justify-between items-center p-2 rounded-lg hover:bg-stone-50"
              >
                <span class="text-sm truncate">{chart.name}</span>
                <button
                  onClick={() => handleAddChart(chart.id)}
                  class="rounded-md p-1 text-[#7c3aed] hover:bg-stone-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grid de tablero */}
        <div class="flex-1 rounded-xl border border-stone-200 bg-white p-4">
          <h3 class="font-semibold mb-3">Layout del tablero</h3>
          <div class="grid grid-cols-12 gap-4 auto-rows-min">
            {dashboard.dashboard_charts?.map((dc: any) => (
              <div
                key={dc.id}
                class="col-span-12 rounded-lg border border-stone-200 bg-stone-50 p-3"
                style={{
                  gridColumn: `span ${dc.width || 6}`,
                  gridRow: `span ${dc.height || 4}`,
                }}
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium">
                      {dc.chart?.name || `Gráfica ${dc.chart_id}`}
                    </h4>
                    {editingChartId === dc.id ? (
                      <div class="mt-2 space-y-2">
                        <div class="flex gap-2 text-sm">
                          <label>
                            X:{" "}
                            <input
                              type="number"
                              class="w-16 border rounded px-1"
                              value={tempPosition.position_x}
                              onChange={(e) =>
                                setTempPosition({
                                  ...tempPosition,
                                  position_x: parseInt(
                                    (e.target as HTMLInputElement).value,
                                  ),
                                })
                              }
                            />
                          </label>
                          <label>
                            Y:{" "}
                            <input
                              type="number"
                              class="w-16 border rounded px-1"
                              value={tempPosition.position_y}
                              onChange={(e) =>
                                setTempPosition({
                                  ...tempPosition,
                                  position_y: parseInt(
                                    (e.target as HTMLInputElement).value,
                                  ),
                                })
                              }
                            />
                          </label>
                          <label>
                            Ancho:{" "}
                            <input
                              type="number"
                              class="w-16 border rounded px-1"
                              value={tempPosition.width}
                              onChange={(e) =>
                                setTempPosition({
                                  ...tempPosition,
                                  width: parseInt(
                                    (e.target as HTMLInputElement).value,
                                  ),
                                })
                              }
                            />
                          </label>
                          <label>
                            Alto:{" "}
                            <input
                              type="number"
                              class="w-16 border rounded px-1"
                              value={tempPosition.height}
                              onChange={(e) =>
                                setTempPosition({
                                  ...tempPosition,
                                  height: parseInt(
                                    (e.target as HTMLInputElement).value,
                                  ),
                                })
                              }
                            />
                          </label>
                        </div>
                        <div class="flex gap-2">
                          <button
                            onClick={() => handleUpdatePosition(dc.id)}
                            class="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingChartId(null)}
                            class="text-xs bg-stone-300 px-2 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="mt-1 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingChartId(dc.id);
                            setTempPosition({
                              position_x: dc.position_x,
                              position_y: dc.position_y,
                              width: dc.width,
                              height: dc.height,
                            });
                          }}
                          class="text-xs text-stone-500 hover:text-stone-800"
                        >
                          <Move size={12} /> Posición
                        </button>
                        <button
                          onClick={() => loadPreview(dc.chart_id, dc.id)}
                          class="text-xs text-blue-500"
                        >
                          Vista previa
                        </button>
                        <button
                          onClick={() => removeChartFromDashboard(dc.id)}
                          class="text-xs text-red-500"
                        >
                          <Trash2 size={12} /> Quitar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {previewLoading[dc.id] && (
                  <div class="text-sm text-stone-400 mt-2">Cargando...</div>
                )}
                {previewData[dc.id] && (
                  <div class="mt-2 text-xs text-stone-500 overflow-x-auto">
                    <pre>
                      {JSON.stringify(
                        previewData[dc.id].rows?.slice(0, 3),
                        null,
                        2,
                      )}
                    </pre>
                    <span class="text-[11px]">
                      ({previewData[dc.id].execution_time_ms} ms)
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {(!dashboard.dashboard_charts ||
            dashboard.dashboard_charts.length === 0) && (
            <p class="text-sm text-stone-400 text-center py-8">
              Agrega gráficas desde la lista lateral
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
