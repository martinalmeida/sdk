import {
  LocationProvider,
  Router,
  Route,
  hydrate,
  prerender as ssr,
} from "preact-iso";
import AuthPage from "./pages/Auth/index";
import RoutesDataCore from "./pages/DataCore/Routes";
import { NotFound } from "./pages/_404";
import { isAuthenticated } from "./pages/Auth/stores";
import "./style.css";
import { ComponentChildren } from "preact";

function ProtectedRoute({
  component: Component,
}: {
  component: () => ComponentChildren;
}) {
  if (!isAuthenticated.value) {
    window.location.href = "/";
    return null;
  }
  return <Component />;
}

export function App() {
  return (
    <LocationProvider>
      <main>
        <Router>
          <Route path="/" component={AuthPage} />
          <Route
            path="/data-core/:rest*"
            component={() => <ProtectedRoute component={RoutesDataCore} />}
          />
          <Route default component={NotFound} />
        </Router>
      </main>
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
