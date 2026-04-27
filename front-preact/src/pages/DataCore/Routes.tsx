import { useRoute } from "preact-iso";
import { DataCoreLayout } from "./Core/layouts/DataCoreLayout";
import { MatchRoute, RouteDefinition } from "../../tools/router/MatchRoute";
import "./style.css";

import Home from "./Home/index";
import Users from "./Users/index";
import EditUser from "./Users/edit";

const routes: RouteDefinition[] = [
  { path: "/data-core", component: Home },
  { path: "/data-core/usuarios", component: Users },
  { path: "/data-core/usuarios/editar/:id", component: EditUser },
];

export default function RoutesDataCore() {
  const { path } = useRoute();
  const { component: Component, params } = MatchRoute(path, routes);

  return (
    <DataCoreLayout>
      <Component params={params} />
    </DataCoreLayout>
  );
}