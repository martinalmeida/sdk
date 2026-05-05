import { useEffect } from "preact/hooks";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { SelectComponent } from "../Core/components/SelectComponent";
import { setPageTitle } from "../Core/hooks";
import { usePermissions } from "./hooks";

const columns = [
  { key: "label", label: "Permiso" },
  { key: "name", label: "Identificador" },
  { key: "group", label: "Grupo" },
  { key: "program", label: "Programa" },
];

export default function PermissionsPage() {
  const {
    permissions,
    loading,
    filterProgramId,
    setFilterProgramId,
    programs,
  } = usePermissions();

  useEffect(() => {
    setPageTitle("Permisos", "Listado de permisos del sistema");
  }, []);

  if (loading) return <LoaderComponent message="Cargando permisos..." />;

  const data = permissions.map((perm) => ({
    label: perm.label,
    name: perm.name,
    group: perm.group,
    program: perm.program?.name || "Todos",
  }));

  return (
    <div class="p-6">
      <NoticeComponent
        variant="info"
        title="ℹ️ Permisos del sistema"
        description="Los permisos se asignan a través de roles o directamente a usuarios. No se pueden crear/editar desde la interfaz (se definen en seeders o migraciones)."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Permisos</h1>
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
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["label", "name"]}
        pageSize={15}
      />
    </div>
  );
}
