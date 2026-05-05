import { useRoute } from "preact-iso";
import { AdminCoreLayout } from "./Core/layouts/AdminCoreLayout";
import { MatchRoute, RouteDefinition } from "../../tools/router/MatchRoute";
import "./style.css";

import Home from "./Home/index";
import Users from "./Users/index";
import Roles from "./Roles/index";
import Permission from "./Permissions/index";
import Programs from "./Programs/index";

const routes: RouteDefinition[] = [
  { path: "/admin-core", component: Home },
  { path: "/admin-core/usuarios", component: Users },
  { path: "/admin-core/roles", component: Roles },
  { path: "/admin-core/permisos", component: Permission },
  { path: "/admin-core/programas", component: Programs },
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
