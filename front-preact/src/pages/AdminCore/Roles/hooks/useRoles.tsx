import { useState, useEffect } from "preact/hooks";
import { roles, rolesLoading, rolesError } from "../stores/rolesStore";
import { rolesApi } from "../services";
import { programs as programsSignal } from "../../Users/stores/programsStore";
import { catalogsApi } from "../../Users/services/catalogsApi";

export function useRoles() {
  const [openModal, setOpenModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(false);

  //Cargar programas para el select
  const loadPrograms = async () => {
    if (programsSignal.value.length === 0) {
      const res = await catalogsApi.getPrograms();
      if (res.data) programsSignal.value = res.data;
    }
  };

  const loadRoles = async () => {
    rolesLoading.value = true;
    const res = await rolesApi.getRoles();
    if (res.data) roles.value = res.data;
    else rolesError.value = res.error || "Error";
    rolesLoading.value = false;
  };

  const handleSubmit = async () => {
    if (!name || !label) return;
    setLoading(true);
    const payload = {
      name,
      label,
      description: description || null,
      is_global: isGlobal,
      program_id: isGlobal ? null : programId ? parseInt(programId) : null,
    };
    let res;
    if (editingRole) {
      res = await rolesApi.updateRole(editingRole.id, payload);
    } else {
      res = await rolesApi.createRole(payload);
    }
    if (!res.error) {
      await loadRoles();
      setOpenModal(false);
      resetForm();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setLabel("");
    setDescription("");
    setIsGlobal(false);
    setProgramId("");
    setEditingRole(null);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
    loadPrograms();
  };

  const openEdit = (role: any) => {
    setName(role.name);
    setLabel(role.label);
    setDescription(role.description || "");
    setIsGlobal(role.is_global);
    setProgramId(role.program_id?.toString() || "");
    setEditingRole(role);
    setOpenModal(true);
    loadPrograms();
  };

  const deleteRole = async (id: number) => {
    if (confirm("¿Eliminar este rol?")) {
      const res = await rolesApi.deleteRole(id);
      if (!res.error) await loadRoles();
      else alert(res.error);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return {
    roles: roles.value,
    loading: rolesLoading.value,
    error: rolesError.value,
    openModal,
    setOpenModal,
    editingRole,
    name,
    setName,
    label,
    setLabel,
    description,
    setDescription,
    isGlobal,
    setIsGlobal,
    programId,
    setProgramId,
    loadingSubmit: loading,
    handleSubmit,
    openCreate,
    openEdit,
    deleteRole,
    programs: programsSignal.value,
  };
}
