import { useState, useEffect } from "preact/hooks";
import {
  permissions,
  permissionsLoading,
  permissionsError,
  Permission,
} from "../stores/permissionsStore";
import { permissionsApi } from "../services/permissionsApi";
import { catalogsApi } from "../../Users/services/catalogsApi";
import { programs as programsSignal } from "../../Users/stores/programsStore";

export function usePermissions() {
  const [filterProgramId, setFilterProgramId] = useState("");

  const loadPermissions = async () => {
    permissionsLoading.value = true;
    const res = await permissionsApi.getPermissions(
      filterProgramId ? parseInt(filterProgramId) : undefined,
    );
    if (res.data) {
      permissions.value = res.data;
    } else {
      permissionsError.value = res.error || "Error al cargar permisos";
    }
    permissionsLoading.value = false;
  };

  const loadPrograms = async () => {
    if (programsSignal.value.length === 0) {
      const res = await catalogsApi.getPrograms();
      if (res.data) programsSignal.value = res.data;
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
  };
}
