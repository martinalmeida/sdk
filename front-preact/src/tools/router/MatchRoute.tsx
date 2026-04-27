import { FunctionalComponent } from "preact";
import { NotFound } from "../../pages/_404";

export interface RouteDefinition {
  path: string;
  component: FunctionalComponent<{ params?: Record<string, string> }>;
}

export function MatchRoute(
  path: string,
  routes: RouteDefinition[],
): {
  component: RouteDefinition["component"];
  params: Record<string, string>;
} {
  for (const route of routes) {
    const keys: string[] = [];
    const pattern = route.path.replace(
      /:([^/]+)/g,
      (_: string, key: string) => {
        keys.push(key);
        return "([^/]+)";
      },
    );

    const match = path.match(new RegExp(`^${pattern}$`));
    if (match) {
      const params = keys.reduce(
        (acc, key, i) => {
          acc[key] = match[i + 1];
          return acc;
        },
        {} as Record<string, string>,
      );
      return { component: route.component, params };
    }
  }

  return { component: NotFound, params: {} };
}