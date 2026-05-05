import { useEffect } from "preact/hooks";
import { Pencil, Trash2, Plus } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { SelectComponent } from "../Core/components/SelectComponent";
import { setPageTitle } from "../Core/hooks";
import { usePermissions } from "./hooks";
import PermissionFormComponent from "./components/PermissionFormComponent";

const columns = [
  { key: "label", label: "Permiso" },
  { key: "name", label: "Identificador" },
  { key: "group", label: "Grupo" },
  { key: "program", label: "Programa" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function PermissionsPage() {
  const {
    permissions,
    loading,
    filterProgramId,
    setFilterProgramId,
    programs,
    openModal,
    setOpenModal,
    openCreate,
    openEdit,
    deletePermission,
    ...form
  } = usePermissions();

  useEffect(() => {
    setPageTitle("Permisos", "Gestión de permisos del sistema");
  }, []);

  if (loading) return <LoaderComponent message="Cargando permisos..." />;

  const data = permissions.map((perm) => ({
    label: perm.label,
    name: perm.name,
    group: perm.group,
    program: perm.program?.name || "Todos",
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => openEdit(perm)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deletePermission(perm.id)}
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
        title="ℹ️ Permisos del sistema"
        description="Cree, edite o elimine permisos. Los permisos se asignan a roles (desde la edición del rol)."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Permisos</h1>
        <div class="flex gap-2">
          <div class="flex items-center gap-2">
            <label class="text-sm">Filtrar por programa:</label>
            <SelectComponent
              value={filterProgramId}
              onChange={(e) =>
                setFilterProgramId((e.target as HTMLSelectElement).value)
              }
            >
              <option value="">Todos</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </SelectComponent>
          </div>
          <button
            onClick={openCreate}
            class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-white"
          >
            <Plus size={16} /> Nuevo permiso
          </button>
        </div>
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["label", "name"]}
        pageSize={15}
      />
      <PermissionFormComponent
        {...form}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={form.handleSubmit}
        loading={form.loadingSubmit}
      />
    </div>
  );
}
