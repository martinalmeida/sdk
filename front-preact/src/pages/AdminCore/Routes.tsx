import { useRoute } from "preact-iso";
import { AdminCoreLayout } from "./Core/layouts/AdminCoreLayout";
import { MatchRoute, RouteDefinition } from "../../tools/router/MatchRoute";
import "./style.css";

import Home from "./Home/index";
import Users from "./Users/index";
import EditUser from "./Users/edit";

const routes: RouteDefinition[] = [
  { path: "/admin-core", component: Home },
  { path: "/admin-core/usuarios", component: Users },
  { path: "/admin-core/usuarios/editar/:id", component: EditUser },
];

export default function RoutesAdminCore() {
  const { path } = useRoute();
  const { component: Component, params } = MatchRoute(path, routes);

  return (
    <AdminCoreLayout>
      <Component params={params} />
    </AdminCoreLayout>
  );
}
