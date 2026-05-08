import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Pencil, Trash2, Plus, Eye } from "lucide-preact";
import DataTableComponent, {
  type Column,
} from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { useCharts } from "./hooks";

const columns: Column[] = [
  { key: "name", label: "Nombre" },
  { key: "chart_type", label: "Tipo" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function ChartsPage() {
  const { route } = useLocation();
  const { charts, loading, deleteChart } = useCharts();

  useEffect(() => {
    setPageTitle("Gráficas", "Gestión de gráficas del sistema");
  }, []);

  if (loading) return <LoaderComponent message="Cargando gráficas..." />;

  const data = charts.map((chart) => ({
    name: chart.name,
    chart_type: chart.chart_type?.label || chart.chart_type_id,
    status: chart.status,
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => route(`/data-core/graficas/${chart.id}/editar`)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deleteChart(chart.id)}
          class="rounded-md bg-stone-100 p-1.5 text-red-600"
        >
          <Trash2 size={14} />
        </button>
        <button
          onClick={() => route(`/data-core/graficas/${chart.id}/preview`)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Eye size={14} />
        </button>
      </div>
    ),
  }));

  return (
    <div class="p-6">
      <NoticeComponent
        variant="info"
        title="ℹ️ Gráficas"
        description="Crea gráficas a partir de consultas SQL. Primero escribe la consulta y luego asígnale un tipo para validar su estructura."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Gráficas</h1>
        <button
          onClick={() => route("/data-core/graficas/nueva")}
          class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-white"
        >
          <Plus size={16} /> Nueva gráfica
        </button>
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["name"]}
        pageSize={10}
      />
    </div>
  );
}
