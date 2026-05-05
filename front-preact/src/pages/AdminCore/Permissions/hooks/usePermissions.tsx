import { useState, useEffect } from "preact/hooks";
import {
  permissions,
  permissionsLoading,
  permissionsError,
  type Permission,
} from "../stores/permissionsStore";
import { permissionsApi } from "../services";
import { catalogsApi } from "../../Users/services/catalogsApi";
import { programs as programsSignal } from "../../Users/stores/programsStore";

export function usePermissions() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [group, setGroup] = useState("");
  const [programId, setProgramId] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [filterProgramId, setFilterProgramId] = useState("");

  const loadPermissions = async () => {
    permissionsLoading.value = true;
    const res = await permissionsApi.getPermissions(
      filterProgramId ? parseInt(filterProgramId) : undefined,
    );
    if (res.data) permissions.value = res.data;
    else permissionsError.value = res.error || "Error";
    permissionsLoading.value = false;
  };

  const loadPrograms = async () => {
    if (programsSignal.value.length === 0) {
      const res = await catalogsApi.getPrograms();
      if (res.data) programsSignal.value = res.data;
    }
  };

  const resetForm = () => {
    setName("");
    setLabel("");
    setGroup("");
    setProgramId("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
    loadPrograms();
  };

  const openEdit = (perm: Permission) => {
    setName(perm.name);
    setLabel(perm.label);
    setGroup(perm.group);
    setProgramId(perm.program_id?.toString() || "");
    setEditing(perm);
    setOpenModal(true);
    loadPrograms();
  };

  const handleSubmit = async () => {
    if (!name || !label || !group) return;
    setLoadingSubmit(true);
    const payload = {
      name,
      label,
      group,
      program_id: programId ? parseInt(programId) : null,
    };
    let res;
    if (editing) {
      res = await permissionsApi.updatePermission(editing.id, payload);
    } else {
      res = await permissionsApi.createPermission(payload);
    }
    if (!res.error) {
      await loadPermissions();
      setOpenModal(false);
      resetForm();
    } else alert(res.error);
    setLoadingSubmit(false);
  };

  const deletePermission = async (id: number) => {
    if (confirm("¿Eliminar este permiso? Puede afectar roles que lo usen.")) {
      const res = await permissionsApi.deletePermission(id);
      if (!res.error) await loadPermissions();
      else alert(res.error);
    }
  };

  useEffect(() => {
    loadPermissions();
    loadPrograms();
  }, [filterProgramId]);

  return {
    permissions: permissions.value,
    loading: permissionsLoading.value,
    error: permissionsError.value,
    filterProgramId,
    setFilterProgramId,
    programs: programsSignal.value,
    // Formulario
    openModal,
    setOpenModal,
    editing,
    name,
    setName,
    label,
    setLabel,
    group,
    setGroup,
    programId,
    setProgramId,
    loadingSubmit,
    handleSubmit,
    openCreate,
    openEdit,
    deletePermission,
  };
}
