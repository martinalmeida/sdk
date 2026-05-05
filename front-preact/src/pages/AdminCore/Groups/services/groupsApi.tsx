import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const groupsApi = {
  getGroups: () =>
    CoreApi.get<any[]>("/admin-core/groups", { token: getToken() }),
  getGroup: (id: number) =>
    CoreApi.get<any>(`/admin-core/groups/${id}`, { token: getToken() }),
  createGroup: (data: any) =>
    CoreApi.post("/admin-core/groups", data, { token: getToken() }),
  updateGroup: (id: number, data: any) =>
    CoreApi.put(`/admin-core/groups/${id}`, data, { token: getToken() }),
  deleteGroup: (id: number) =>
    CoreApi.delete(`/admin-core/groups/${id}`, { token: getToken() }),
  assignUsers: (groupId: number, userIds: number[]) =>
    CoreApi.post(
      `/admin-core/groups/${groupId}/assign-users`,
      { user_ids: userIds },
      { token: getToken() },
    ),
  removeUsers: (groupId: number, userIds: number[]) =>
    CoreApi.delete(`/admin-core/groups/${groupId}/remove-users`, {
      body: { user_ids: userIds },
      token: getToken(),
    }),
};
