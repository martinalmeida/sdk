import { useEffect } from "preact/hooks";
import { Pencil, Trash2, Plus } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { usePrograms } from "./hooks";
import ProgramFormComponent from "./components/ProgramFormComponent";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "slug", label: "Slug" },
  { key: "version", label: "Versión" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function ProgramsPage() {
  const { programs, loading, deleteProgram, ...form } = usePrograms();

  useEffect(() => {
    setPageTitle("Programas", "Gestión de programas de la suite");
  }, []);

  if (loading) {
    return <LoaderComponent message="Cargando programas..." />;
  }

  const data = programs.map((program) => ({
    name: program.name,
    slug: program.slug,
    version: program.version,
    status: program.is_active ? (
      <span class="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
        Activo
      </span>
    ) : (
      <span class="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
        Inactivo
      </span>
    ),
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => form.openEdit(program)}
          class="rounded-md bg-stone-100 p-1.5 text-stone-600 hover:bg-stone-200"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deleteProgram(program.id)}
          class="rounded-md bg-stone-100 p-1.5 text-red-600 hover:bg-red-100"
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
        title="ℹ️ Programas de la suite"
        description="Cada programa agrupa roles, permisos y usuarios. El slug se usa en las rutas (ej. 'data-core', 'admin-core')."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Programas</h1>
        <button
          onClick={form.openCreate}
          class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-sm text-white hover:bg-[#6d28d9]"
        >
          <Plus size={16} />
          Nuevo programa
        </button>
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["name", "slug"]}
        pageSize={10}
      />
      <ProgramFormComponent
        open={form.openModal}
        onClose={() => form.setOpenModal(false)}
        onSubmit={form.handleSubmit}
        loading={form.loadingSubmit}
        editing={form.editing}
        name={form.name}
        setName={form.setName}
        slug={form.slug}
        setSlug={form.setSlug}
        description={form.description}
        setDescription={form.setDescription}
        version={form.version}
        setVersion={form.setVersion}
        isActive={form.isActive}
        setIsActive={form.setIsActive}
      />
    </div>
  );
}
