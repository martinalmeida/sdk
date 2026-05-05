import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const permissionsApi = {
  getPermissions: (programId?: number) =>
    CoreApi.get<any[]>(
      `/admin-core/permissions${programId ? `?program_id=${programId}` : ""}`,
      { token: getToken() },
    ),
  getPermission: (id: number) =>
    CoreApi.get(`/admin-core/permissions/${id}`, { token: getToken() }),
  createPermission: (data: any) =>
    CoreApi.post("/admin-core/permissions", data, { token: getToken() }),
  updatePermission: (id: number, data: any) =>
    CoreApi.put(`/admin-core/permissions/${id}`, data, { token: getToken() }),
  deletePermission: (id: number) =>
    CoreApi.delete(`/admin-core/permissions/${id}`, { token: getToken() }),
};
