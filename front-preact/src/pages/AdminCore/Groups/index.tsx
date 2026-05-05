import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Pencil, Trash2, Plus, Users } from "lucide-preact";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { useGroups } from "./hooks";
import GroupFormComponent from "./components/GroupFormComponent";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "memberCount", label: "Miembros" },
  { key: "actions", label: "Acciones", align: "center" as const },
];

export default function GroupsPage() {
  const { route } = useLocation();
  const { groups, loading, deleteGroup, availableUsers, ...form } = useGroups();

  useEffect(() => {
    setPageTitle("Grupos", "Agrupación de usuarios por equipos");
  }, []);

  if (loading) return <LoaderComponent message="Cargando grupos..." />;

  const data = groups.map((group) => ({
    name: group.name,
    description: group.description || "—",
    memberCount: group.users?.length || 0,
    actions: (
      <div class="flex justify-center gap-2">
        <button
          onClick={() => route(`/admin-core/grupos/${group.id}/miembros`)}
          class="rounded-md bg-stone-100 p-1.5 text-stone-600 hover:bg-stone-200"
          title="Gestionar miembros"
        >
          <Users size={14} />
        </button>
        <button
          onClick={() => form.openEdit(group)}
          class="rounded-md bg-stone-100 p-1.5 text-stone-600 hover:bg-stone-200"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => deleteGroup(group.id)}
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
        title="ℹ️ Grupos de usuarios"
        description="Los grupos permiten organizar a los usuarios por equipos, departamentos o cualquier categoría. La pertenencia a un grupo no otorga permisos adicionales, solo es organizativa."
      />
      <div class="flex justify-between items-center mb-6 mt-4">
        <h1 class="text-2xl font-bold text-stone-900">Grupos</h1>
        <button
          onClick={form.openCreate}
          class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-white"
        >
          <Plus size={16} /> Nuevo grupo
        </button>
      </div>
      <DataTableComponent
        columns={columns}
        data={data}
        searchKeys={["name"]}
        pageSize={10}
      />
      <GroupFormComponent
        {...form}
        open={form.openModal}
        onClose={() => form.setOpenModal(false)}
        onSubmit={form.handleSubmit}
        loading={form.loadingSubmit}
      />
    </div>
  );
}
