import { useEffect } from "preact/hooks";
import { Pencil, Trash2, Plus } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { usePositions } from "./hooks";
import PositionFormComponent from "./components/PositionFormComponent";

const columns = [
  { key: "name", label: "Cargo" },
  { key: "description", label: "Descripción" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function PositionsPage() {
  const { positions, loading, deletePosition, ...form } = usePositions();

  useEffect(() => {
    setPageTitle("Cargos", "Gestión de cargos laborales");
  }, []);

  if (loading) return <LoaderComponent message="Cargando cargos..." />;

  const data = positions.map((pos) => ({
    name: pos.name,
    description: pos.description || "—",
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => form.openEdit(pos)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deletePosition(pos.id)}
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
        title="ℹ️ Cargos"
        description="Los cargos representan los puestos o roles laborales de los usuarios. Se asignan a los usuarios desde el formulario de edición."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Cargos</h1>
        <button
          onClick={form.openCreate}
          class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-white"
        >
          <Plus size={16} /> Nuevo cargo
        </button>
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["name"]}
        pageSize={10}
      />
      <PositionFormComponent
        {...form}
        open={form.openModal}
        onClose={() => form.setOpenModal(false)}
        onSubmit={form.handleSubmit}
        loading={form.loadingSubmit}
      />
    </div>
  );
}
