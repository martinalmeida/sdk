import { useEffect } from "preact/hooks";
import { Pencil, Trash2, Plus } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { useUsers, useUserForm } from "./hooks";
import UserFormComponent from "./components/UserFormComponent";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "position", label: "Cargo" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function UsersPage() {
  const { users, loading, deleteUser, refreshUsers } = useUsers();
  const form = useUserForm(refreshUsers);

  useEffect(() => {
    setPageTitle("Usuarios", "Gestión de usuarios del sistema");
  }, []);

  if (loading) {
    return <LoaderComponent message="Cargando usuarios..." />;
  }

  const data = users.map((user) => ({
    name: user.name,
    email: user.email,
    position: user.position?.name || "—",
    status: (
      <span
        class={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
          user.status === "active"
            ? "bg-green-100 text-green-700"
            : user.status === "inactive"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        {user.status === "active"
          ? "Activo"
          : user.status === "inactive"
            ? "Inactivo"
            : "Suspendido"}
      </span>
    ),
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => form.openEdit(user)}
          class="rounded-md bg-stone-100 p-1.5 text-stone-600 hover:bg-stone-200"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => {
            if (confirm("¿Eliminar este usuario?")) deleteUser(user.id);
          }}
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
        title="ℹ️ ¿Cómo asignar programas a un usuario?"
        description="Primero crea el usuario con sus datos básicos. Luego, edítalo y en la sección 'Programas asignados' podrás agregar uno o más programas, seleccionar un rol para cada uno y activar/desactivar el acceso."
      />

      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Usuarios</h1>
        <button
          onClick={() => form.openCreate()}
          class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-sm text-white hover:bg-[#6d28d9]"
        >
          <Plus size={16} />
          Nuevo usuario
        </button>
      </div>

      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["name", "email"]}
        pageSize={10}
      />

      <UserFormComponent
        open={form.open}
        onClose={() => form.setOpen(false)}
        onSubmit={form.handleSubmit}
        loading={form.loading}
        editingUser={form.editingUser}
        name={form.name}
        setName={form.setName}
        email={form.email}
        setEmail={form.setEmail}
        password={form.password}
        setPassword={form.setPassword}
        passwordConfirmation={form.passwordConfirmation}
        setPasswordConfirmation={form.setPasswordConfirmation}
        positionId={form.positionId}
        setPositionId={form.setPositionId}
        status={form.status}
        setStatus={form.setStatus}
        assignedPrograms={form.assignedPrograms}
        addProgram={form.addProgram}
        updateAssignedProgram={form.updateAssignedProgram}
        removeProgram={form.removeProgram}
      />
    </div>
  );
}
