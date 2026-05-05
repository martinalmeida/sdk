import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { SelectComponent } from "../Core/components/SelectComponent";
import { FormFieldComponent } from "../Core/components/FormFieldComponent";
import { groupsApi } from "./services";
import { usersApi } from "../Users/services";

interface Props {
  params?: Record<string, string>;
}

export default function GroupMembers({ params }: Props) {
  const groupId = params?.id ? parseInt(params.id) : null;
  const { route } = useLocation();

  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const loadData = async () => {
    if (!groupId) return;
    setLoading(true);
    const [groupRes, usersRes] = await Promise.all([
      groupsApi.getGroup(groupId),
      usersApi.getUsers({ per_page: 9999 }),
    ]);
    if (groupRes.data) {
      setGroup(groupRes.data);
      setMembers(groupRes.data.users || []);
    } else {
      alert("Grupo no encontrado");
      route("/admin-core/grupos");
    }
    if (usersRes.data) setAvailableUsers(usersRes.data.data);
    setLoading(false);
  };

  useEffect(() => {
    if (groupId) {
      setPageTitle("Miembros del grupo", "Administrar integrantes");
      loadData();
    }
  }, [groupId]);

  const handleAddMember = async () => {
    if (!selectedUserId || !groupId) return;
    setAdding(true);
    const res = await groupsApi.assignUsers(groupId, [
      parseInt(selectedUserId),
    ]);
    if (!res.error) {
      await loadData(); // recargar lista actualizada
      setSelectedUserId("");
    } else {
      alert(res.error);
    }
    setAdding(false);
  };

  const handleRemoveMember = async (userId: number) => {
    if (!groupId) return;
    if (confirm("¿Remover este usuario del grupo?")) {
      const res = await groupsApi.removeUsers(groupId, [userId]);
      if (!res.error) await loadData();
      else alert(res.error);
    }
  };

  if (loading) return <LoaderComponent message="Cargando miembros..." />;
  if (!group) return null;

  const nonMembers = availableUsers.filter(
    (u) => !members.some((m) => m.id === u.id),
  );

  return (
    <div class="p-6">
      <button
        onClick={() => route("/admin-core/grupos")}
        class="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft size={14} /> Volver a grupos
      </button>

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-stone-900">{group.name}</h1>
        <p class="text-stone-500">{group.description || "Sin descripción"}</p>
      </div>

      <NoticeComponent
        variant="info"
        icon="👥"
        title="Gestión de miembros"
        description="Agregue o remueva usuarios a este grupo. Los grupos son solo organizativos, no otorgan permisos adicionales."
      />

      <div class="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <div class="flex flex-col sm:flex-row gap-4 items-end mb-6">
          <div class="flex-1">
            <FormFieldComponent label="Añadir usuario al grupo">
              <SelectComponent
                value={selectedUserId}
                onChange={(e) =>
                  setSelectedUserId((e.target as HTMLSelectElement).value)
                }
              >
                <option value="">Seleccionar usuario</option>
                {nonMembers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </SelectComponent>
            </FormFieldComponent>
          </div>
          <button
            onClick={handleAddMember}
            disabled={!selectedUserId || adding}
            class="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-white disabled:opacity-50"
          >
            <UserPlus size={16} /> Agregar
          </button>
        </div>

        <div class="border-t border-stone-200 pt-4">
          <h3 class="mb-3 text-sm font-semibold text-stone-700">
            Miembros actuales ({members.length})
          </h3>
          {members.length === 0 ? (
            <p class="text-sm text-stone-400">Este grupo no tiene miembros.</p>
          ) : (
            <div class="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  class="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2"
                >
                  <div>
                    <p class="font-medium text-stone-800">{member.name}</p>
                    <p class="text-xs text-stone-500">{member.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    class="rounded-md p-1 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
