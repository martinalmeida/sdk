import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
  useLocation,
} from "preact-iso";
import { isAuthenticated, logout } from "./pages/Auth/stores";
import "./style.css";
import { ComponentChildren } from "preact";
import AuthPage from "./pages/Auth/index";
import BasePage from "./pages/Base/index";
import RoutesAdminCore from "./pages/AdminCore/Routes";
import RoutesDataCore from "./pages/DataCore/Routes";
import { NotFound } from "./pages/_404";
import { CoreApi } from "./tools/api";
import { pushToast } from "./tools/alerts";
import ToastContainer from "./tools/alerts/ToastContainer";

//── Configuración global del cliente HTTP ─────────────────────
CoreApi.configure({
  unauthorizedRedirectUrl: "/",
  onUnauthorized: () => {
    logout();
  },
});

//── Interceptor global de errores ─────────────────────────────
const SILENT_STATUSES = [401, 422];
CoreApi.addResponseInterceptor((response) => {
  if (
    !response.ok &&
    response.error &&
    !SILENT_STATUSES.includes(response.status)
  ) {
    pushToast(response.error, "error");
  }
  return response;
});

//── Guards de rutas ───────────────────────────────────────────
function ProtectedRoute({
  component: Component,
}: {
  component: () => ComponentChildren;
}) {
  const { route } = useLocation();
  if (!isAuthenticated.value) {
    route("/", true);
    return null;
  }
  return <Component />;
}

function GuestRoute({
  component: Component,
}: {
  component: () => ComponentChildren;
}) {
  const { route } = useLocation();
  if (isAuthenticated.value) {
    route("/base", true);
    return null;
  }
  return <Component />;
}

export function App() {
  return (
    <LocationProvider>
      <main>
        <Router>
          <Route
            path="/"
            component={() => <GuestRoute component={AuthPage} />}
          />
          <Route
            path="/base"
            component={() => <ProtectedRoute component={BasePage} />}
          />
          <Route
            path="/admin-core/:rest*"
            component={() => <ProtectedRoute component={RoutesAdminCore} />}
          />
          <Route
            path="/data-core/:rest*"
            component={() => <ProtectedRoute component={RoutesDataCore} />}
          />
          <Route default component={NotFound} />
        </Router>
      </main>
      <ToastContainer />
    </LocationProvider>
  );
}

if (typeof window !== "undefined") {
  const appElement = document.getElementById("app")! as HTMLElement;
  hydrate(<App />, appElement);
}

export async function prerender(data: Record<string, unknown>) {
  return await ssr(<App {...data} />);
}
