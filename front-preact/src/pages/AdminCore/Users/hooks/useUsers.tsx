import { useState, useEffect } from "preact/hooks";
import { users, usersLoading, usersError } from "../stores/usersStore";
import {
  programs,
  programsLoading,
  programsError,
} from "../stores/programsStore";
import { roles, rolesLoading, rolesError } from "../stores/rolesStore";
import {
  positions,
  positionsLoading,
  positionsError,
} from "../stores/positionsStore";
import { usersApi } from "../services/usersApi";
import { catalogsApi } from "../services/catalogsApi";

export function useUsers() {
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    usersLoading.value = true;
    usersError.value = null;
    //Cargamos todos los usuarios (sin paginación)
    const res = await usersApi.getUsers({ per_page: 9999 });
    if (res.data) {
      users.value = res.data.data; //asumiendo que la API devuelve { data: [...] }
    } else {
      usersError.value = res.error || "Error al cargar usuarios";
    }
    usersLoading.value = false;
  };

  const loadCatalogs = async () => {
    //Programas
    programsLoading.value = true;
    const progRes = await catalogsApi.getPrograms();
    if (progRes.data) programs.value = progRes.data;
    else programsError.value = progRes.error;
    programsLoading.value = false;

    //Roles
    rolesLoading.value = true;
    const rolesRes = await catalogsApi.getRoles();
    if (rolesRes.data) roles.value = rolesRes.data;
    else rolesError.value = rolesRes.error;
    rolesLoading.value = false;

    //Posiciones
    positionsLoading.value = true;
    const posRes = await catalogsApi.getPositions();
    if (posRes.data) positions.value = posRes.data;
    else positionsError.value = posRes.error;
    positionsLoading.value = false;
  };

  const deleteUser = async (userId: number) => {
    const res = await usersApi.deleteUser(userId);
    if (!res.error) await loadUsers();
    return res;
  };

  useEffect(() => {
    Promise.all([loadUsers(), loadCatalogs()]).finally(() => setLoading(false));
  }, []);

  return {
    users: users.value,
    loading: loading || usersLoading.value,
    error: usersError.value,
    deleteUser,
    programs: programs.value,
    roles: roles.value,
    positions: positions.value,
    catalogsLoading:
      programsLoading.value || rolesLoading.value || positionsLoading.value,
  };
}
