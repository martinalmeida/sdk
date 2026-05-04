import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const usersApi = {
  getUsers: (params?: { page?: number; per_page?: number; search?: string }) =>
    CoreApi.get<{
      data: any[];
      current_page: number;
      last_page: number;
      total: number;
    }>("/admin-core/users", { params, token: getToken() }),

  createUser: (data: any) =>
    CoreApi.post("/admin-core/users", data, { token: getToken() }),

  updateUser: (userId: number, data: any) =>
    CoreApi.put(`/admin-core/users/${userId}`, data, { token: getToken() }),

  deleteUser: (userId: number) =>
    CoreApi.delete(`/admin-core/users/${userId}`, { token: getToken() }),

  getUser: (userId: number) =>
    CoreApi.get(`/admin-core/users/${userId}`, { token: getToken() }),

  assignProgram: (
    userId: number,
    programId: number,
    roleId: number,
    isActive = true,
  ) =>
    CoreApi.post(
      `/admin-core/users/${userId}/assign-program`,
      { program_id: programId, role_id: roleId, is_active: isActive },
      { token: getToken() },
    ),

  removeProgram: (userId: number, programId: number) =>
    CoreApi.delete(`/admin-core/users/${userId}/remove-program/${programId}`, {
      token: getToken(),
    }),

  grantPermission: (userId: number, permissionId: number, programId: number) =>
    CoreApi.post(
      `/admin-core/users/${userId}/grant-permission`,
      { permission_id: permissionId, program_id: programId },
      { token: getToken() },
    ),

  revokePermission: (userId: number, permissionId: number, programId: number) =>
    CoreApi.delete(`/admin-core/users/${userId}/revoke-permission`, {
      body: { permission_id: permissionId, program_id: programId },
      token: getToken(),
    }),
};
