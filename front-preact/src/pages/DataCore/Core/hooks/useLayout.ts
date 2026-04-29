import { signal, computed } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  authUser,
  userName,
  userCargo,
  userRol,
  userEstado,
} from "../../../Auth/stores";
import { useAuth } from "../../../Auth/hooks";
import { PROGRAMS, MenuItem } from "../../../../tools/apps";

//── Signals de UI ─────────────────────────────────────────────
export const sidebarOpen = signal(false);
export const userMenuOpen = signal(false);
export const pageTitle = signal("Dashboard");
export const pageSubtitle = signal("Panel principal");

export const sidebarTranslate = computed(() =>
  sidebarOpen.value ? "translate-x-0" : "-translate-x-full",
);

export function openSidebar() {
  sidebarOpen.value = true;
}
export function closeSidebar() {
  sidebarOpen.value = false;
}
export function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}
export function closeUserMenu() {
  userMenuOpen.value = false;
}
export function setPageTitle(title: string, subtitle?: string) {
  pageTitle.value = title;
  pageSubtitle.value = subtitle ?? "";
}

//── Hook principal ─────────────────────────────────────────────
export function useLayout() {
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { handleLogout } = useAuth();
  const [currentPathname, setCurrentPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/",
  );

  //Sincronizar cambios de ruta (con tipado correcto de 'this')
  useEffect(() => {
    const syncLocation = () => {
      if (typeof window !== "undefined") {
        setCurrentPathname(window.location.pathname);
      }
    };
    syncLocation();
    if (typeof window === "undefined") return;

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    const emitLocationChange = () =>
      window.dispatchEvent(new Event("locationchange"));

    history.pushState = function (
      this: History,
      ...args: Parameters<typeof history.pushState>
    ) {
      const result = originalPushState.apply(this, args);
      emitLocationChange();
      return result;
    };

    history.replaceState = function (
      this: History,
      ...args: Parameters<typeof history.replaceState>
    ) {
      const result = originalReplaceState.apply(this, args);
      emitLocationChange();
      return result;
    };

    window.addEventListener("popstate", syncLocation);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("locationchange", syncLocation);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", syncLocation);
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("locationchange", syncLocation);
    };
  }, []);

  //Programa activo basado en la URL
  const activeProgram = computed(() => {
    const slug = currentPathname.split("/").filter(Boolean)[0] || "data-core";
    return PROGRAMS[slug] ?? PROGRAMS["data-core"];
  });

  const baseUrl = computed(() => activeProgram.value.url.replace(/\/$/, ""));

  //Determinar qué ítem del menú está activo
  const getActiveMenuItem = (
    menus: MenuItem[],
    pathname: string,
    basePath: string,
  ): string | null => {
    const relativePath = pathname.replace(basePath, "") || "/";
    for (const item of menus) {
      if (item.matchExact) {
        if (relativePath === item.href) return item.label;
      } else {
        if (relativePath.startsWith(item.href) && item.href !== "/")
          return item.label;
        if (item.href === "/" && relativePath === "/") return item.label;
      }
    }
    return null;
  };

  const activeMenuItemLabel = computed(() => {
    const menus = activeProgram.value.menus ?? [];
    const path = currentPathname;
    const base = baseUrl.value;
    return getActiveMenuItem(menus, path, base);
  });

  //Detectar si es móvil (<1024px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  //Cerrar sidebar solo si es móvil (para usarlo en los enlaces)
  const handleCloseSidebar = () => {
    if (isMobile) closeSidebar();
  };

  //Bloqueo de scroll cuando sidebar está abierto en móvil
  useEffect(() => {
    document.body.style.overflow = sidebarOpen.value ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen.value]);

  //Cierra menú de usuario al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        closeUserMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function singOut() {
    await handleLogout();
    window.location.href = "/";
  }

  return {
    userMenuRef,
    sidebarOpen,
    userMenuOpen,
    pageTitle,
    pageSubtitle,
    sidebarTranslate,
    openSidebar,
    closeSidebar: handleCloseSidebar,
    toggleUserMenu,
    setPageTitle,
    activeProgram,
    baseUrl,
    activeMenuItemLabel,
    isMobile,
    user: authUser,
    userName,
    userRol,
    userCargo,
    userEstado,
    isAuthenticated: computed(() => authUser.value !== null),
    singOut,
  };
}
