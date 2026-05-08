import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Pencil, Trash2, Plus, Eye } from "lucide-preact";
import DataTableComponent, {
  type Column,
} from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { useDashboards } from "./hooks";

const columns: Column[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function DashboardsPage() {
  const { route } = useLocation();
  const { dashboards, loading, deleteDashboard } = useDashboards();

  useEffect(() => {
    setPageTitle("Tableros", "Gestión de tableros");
  }, []);

  if (loading) return <LoaderComponent message="Cargando tableros..." />;

  const data = dashboards.map((dashboard) => ({
    name: dashboard.name,
    description: dashboard.description || "—",
    status: dashboard.status,
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => route(`/data-core/tableros/${dashboard.id}/builder`)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => route(`/data-core/tableros/${dashboard.id}/view`)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => deleteDashboard(dashboard.id)}
          class="rounded-md bg-stone-100 p-1.5 text-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
  }));

  return (
    <div class="p-6">
      <NoticeComponent
        variant="info"
        title="ℹ️ Tableros"
        description="Los tableros agrupan gráficas. Puede asignar acceso a usuarios y grupos."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Tableros</h1>
        <button
          onClick={() => route("/data-core/tableros/nuevo")}
          class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-white"
        >
          <Plus size={16} /> Nuevo tablero
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
