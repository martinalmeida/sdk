import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const programsApi = {
  getPrograms: () =>
    CoreApi.get<any[]>("/admin-core/programs", { token: getToken() }),

  createProgram: (data: any) =>
    CoreApi.post("/admin-core/programs", data, { token: getToken() }),

  updateProgram: (id: number, data: any) =>
    CoreApi.put(`/admin-core/programs/${id}`, data, { token: getToken() }),

  deleteProgram: (id: number) =>
    CoreApi.delete(`/admin-core/programs/${id}`, { token: getToken() }),
};
