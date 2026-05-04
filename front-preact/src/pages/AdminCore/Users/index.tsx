import { useEffect } from "preact/hooks";
import { Pencil, Trash2 } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import { setPageTitle } from "../Core/hooks";
import { useUsers } from "./hooks";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "position", label: "Cargo" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function UsersPage() {
  const { users, loading, deleteUser } = useUsers();

  useEffect(() => {
    setPageTitle("Usuarios", "Gestión de usuarios del sistema");
  }, []);

  if (loading) {
    return <LoaderComponent message="Cargando usuarios..." />;
  }

  //Transformar usuarios al formato que espera DataTable
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
          onClick={() => {
            //TODO: abrir modal de edición
            console.log("Editar", user.id);
          }}
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
    <DataTableComponent
      columns={columns}
      data={data}
      searchKeys={["name", "email"]}
      pageSize={10}
    />
  );
}
