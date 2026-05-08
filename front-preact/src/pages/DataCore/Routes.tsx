import { useRoute } from "preact-iso";
import { DataCoreLayout } from "./Core/layouts/DataCoreLayout";
import { MatchRoute, RouteDefinition } from "../../tools/router/MatchRoute";
import "./style.css";

import Home from "./Home/index";
import ChartsPage from "./Charts/index";
import ChartForm from "./Charts/form";
import ChartPreview from "./Charts/preview";
import DashboardsPage from "./Dashboards/index";
import DashboardForm from "./Dashboards/form";
import DashboardBuilder from "./Dashboards/builder";
import DashboardView from "./Dashboards/view";
import ChartTypesPage from "./ChartTypes/index";
import ExecutionLogs from "./Logs/index";

const routes: RouteDefinition[] = [
  { path: "/data-core", component: Home },
  { path: "/data-core/graficas", component: ChartsPage },
  { path: "/data-core/graficas/nueva", component: ChartForm },
  { path: "/data-core/graficas/:id/editar", component: ChartForm },
  { path: "/data-core/graficas/:id/preview", component: ChartPreview },
  { path: "/data-core/tableros", component: DashboardsPage },
  { path: "/data-core/tableros/nuevo", component: DashboardForm },
  { path: "/data-core/tableros/:id/editar", component: DashboardForm },
  { path: "/data-core/tableros/:id/builder", component: DashboardBuilder },
  { path: "/data-core/tableros/:id/view", component: DashboardView },
  { path: "/data-core/tipos-grafico", component: ChartTypesPage },
  { path: "/data-core/logs", component: ExecutionLogs },
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
