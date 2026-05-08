import { CoreApi } from "../../../../tools/api";
import { authToken } from "../../../Auth/stores";

const getToken = () => authToken.value;

export const chartTypesApi = {
  getChartTypes: () =>
    CoreApi.get<any[]>("/data-core/chart-types", { token: getToken() }),
};
