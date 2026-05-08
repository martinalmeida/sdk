import { useState, useEffect } from "preact/hooks";
import {
  groups,
  groupsLoading,
  groupsError,
  type Group,
} from "../stores/groupsStore";
import { groupsApi } from "../services";
import { usersApi } from "../../Users/services";
import { pushToast } from "../../../../tools/alerts";

export function useGroups() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  const loadGroups = async () => {
    groupsLoading.value = true;
    const res = await groupsApi.getGroups();
    if (res.data) groups.value = res.data;
    else groupsError.value = res.error || "Error";
    groupsLoading.value = false;
    return groups.value;
  };

  const loadUsers = async () => {
    const res = await usersApi.getUsers({ per_page: 9999 });
    if (res.data) setAvailableUsers(res.data.data);
    return availableUsers;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = (grp: Group) => {
    setName(grp.name);
    setDescription(grp.description || "");
    setEditing(grp);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!name) return;
    setLoadingSubmit(true);
    const payload = { name, description: description || null };
    const res = editing
      ? await groupsApi.updateGroup(editing.id, payload)
      : await groupsApi.createGroup(payload);

    if (!res.error) {
      await loadGroups();
      await loadUsers();
      setOpenModal(false);
      resetForm();
      pushToast(
        editing
          ? "Grupo actualizado correctamente"
          : "Grupo creado correctamente",
        "success",
      );
    }
    setLoadingSubmit(false);
  };

  const deleteGroup = async (id: number) => {
    if (confirm("¿Eliminar este grupo? Se perderá la asignación a usuarios.")) {
      const res = await groupsApi.deleteGroup(id);
      if (!res.error) {
        await loadGroups();
        await loadUsers();
        pushToast("Grupo eliminado correctamente", "success");
      }
    }
  };

  const addMembers = async (groupId: number, userIds: number[]) => {
    const res = await groupsApi.assignUsers(groupId, userIds);
    if (!res.error) {
      await loadGroups();
      await loadUsers();
      pushToast("Miembros añadidos correctamente", "success");
    }
    return !res.error;
  };

  const removeMember = async (groupId: number, userId: number) => {
    const res = await groupsApi.removeUsers(groupId, [userId]);
    if (!res.error) {
      await loadGroups();
      await loadUsers();
      pushToast("Miembro eliminado del grupo", "success");
    }
    return !res.error;
  };

  useEffect(() => {
    loadGroups();
    loadUsers();
  }, []);

  return {
    groups: groups.value,
    loading: groupsLoading.value,
    error: groupsError.value,
    openModal,
    setOpenModal,
    availableUsers,
    editing,
    name,
    setName,
    description,
    setDescription,
    loadingSubmit,
    handleSubmit,
    openCreate,
    openEdit,
    deleteGroup,
    addMembers,
    removeMember,
  };
}
