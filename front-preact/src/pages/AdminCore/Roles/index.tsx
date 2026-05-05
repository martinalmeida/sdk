import { useEffect } from "preact/hooks";
import { Pencil, Trash2, Plus } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { useRoles } from "./hooks";
import RoleFormComponent from "./components/RoleFormComponent";

const columns = [
  { key: "label", label: "Rol" },
  { key: "name", label: "Identificador" },
  { key: "program", label: "Programa" },
  { key: "is_global", label: "Global" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function RolesPage() {
  const { roles, loading, deleteRole, ...form } = useRoles();

  useEffect(() => {
    setPageTitle("Roles", "Gestión de roles por programa");
  }, []);

  if (loading) return <LoaderComponent message="Cargando roles..." />;

  const data = roles.map((role) => ({
    label: role.label,
    name: role.name,
    program: role.is_global ? "Todos" : role.program?.name || "—",
    is_global: role.is_global ? "Sí" : "No",
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => form.openEdit(role)}
          class="rounded-md bg-stone-100 p-1.5"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deleteRole(role.id)}
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
        title="ℹ️ Gestión de roles"
        description="Los roles pueden ser globales (aplican a todos los programas) o específicos de un programa. Al asignar un rol a un usuario en un programa, se heredan los permisos asociados a ese rol."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Roles</h1>
        <button
          onClick={form.openCreate}
          class="bg-[#7c3aed] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Nuevo rol
        </button>
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["label", "name"]}
        pageSize={10}
      />
      <RoleFormComponent
        {...form}
        open={form.openModal}
        onClose={() => form.setOpenModal(false)}
        onSubmit={form.handleSubmit}
        loading={form.loadingSubmit}
      />
    </div>
  );
}
