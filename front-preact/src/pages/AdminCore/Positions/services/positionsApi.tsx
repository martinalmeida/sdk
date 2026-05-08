import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const positionsApi = {
  getPositions: () =>
    CoreApi.get<any[]>("/admin-core/positions", { token: getToken() }),

  createPosition: (data: any) =>
    CoreApi.post("/admin-core/positions", data, { token: getToken() }),

  updatePosition: (id: number, data: any) =>
    CoreApi.put(`/admin-core/positions/${id}`, data, { token: getToken() }),

  deletePosition: (id: number) =>
    CoreApi.delete(`/admin-core/positions/${id}`, { token: getToken() }),
};
