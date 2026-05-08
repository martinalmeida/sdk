import { useRoute } from "preact-iso";
import { AdminCoreLayout } from "./Core/layouts/AdminCoreLayout";
import { MatchRoute, RouteDefinition } from "../../tools/router/MatchRoute";
import "./style.css";

import Home from "./Home/index";
import Users from "./Users/index";
import Groups from "./Groups/index";
import GroupMembers from "./Groups/members";
import PositionsPage from "./Positions/index";
import Roles from "./Roles/index";
import Programs from "./Programs/index";

const routes: RouteDefinition[] = [
  { path: "/admin-core", component: Home },
  { path: "/admin-core/usuarios", component: Users },
  { path: "/admin-core/grupos", component: Groups },
  { path: "/admin-core/grupos/:id/miembros", component: GroupMembers },
  { path: "/admin-core/roles", component: Roles },
  { path: "/admin-core/cargos", component: PositionsPage },
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
