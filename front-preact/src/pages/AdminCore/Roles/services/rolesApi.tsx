import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const rolesApi = {
  getRoles: (programId?: number) =>
    CoreApi.get<any[]>(
      `/admin-core/roles${programId ? `?program_id=${programId}` : ""}`,
      { token: getToken() },
    ),
  createRole: (data: any) =>
    CoreApi.post("/admin-core/roles", data, { token: getToken() }),
  updateRole: (roleId: number, data: any) =>
    CoreApi.put(`/admin-core/roles/${roleId}`, data, { token: getToken() }),
  deleteRole: (roleId: number) =>
    CoreApi.delete(`/admin-core/roles/${roleId}`, { token: getToken() }),
};
