import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const permissionsApi = {
  getPermissions: (programId?: number) =>
    CoreApi.get<any[]>(
      `/admin-core/permissions${programId ? `?program_id=${programId}` : ""}`,
      { token: getToken() },
    ),
};
