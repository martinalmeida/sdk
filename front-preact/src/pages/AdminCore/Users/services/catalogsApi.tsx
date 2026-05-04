import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const catalogsApi = {
  getPrograms: () =>
    CoreApi.get<any[]>("/admin-core/programs", { token: getToken() }),

  getRoles: (programId?: number) =>
    CoreApi.get<any[]>(
      `/admin-core/roles${programId ? `?program_id=${programId}` : ""}`,
      { token: getToken() },
    ),

  getPositions: () =>
    CoreApi.get<any[]>("/admin-core/positions", { token: getToken() }),
};
