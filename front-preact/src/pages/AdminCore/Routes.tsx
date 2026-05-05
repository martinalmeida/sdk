import { useRoute } from "preact-iso";
import { AdminCoreLayout } from "./Core/layouts/AdminCoreLayout";
import { MatchRoute, RouteDefinition } from "../../tools/router/MatchRoute";
import "./style.css";

import Home from "./Home/index";
import Users from "./Users/index";
import Roles from "./Roles/index";

const routes: RouteDefinition[] = [
  { path: "/admin-core", component: Home },
  { path: "/admin-core/usuarios", component: Users },
  { path: "/admin-core/roles", component: Roles },
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
