import { signal, computed } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import {
  authUser,
  logout,
  userName,
  userCargo,
  userRol,
  userEstado,
} from "../stores";

//Signals de UI (no persisten, son solo de sesión visual)
export const sidebarOpen = signal(false);
export const userMenuOpen = signal(false);
export const pageTitle = signal("Dashboard");
export const pageSubtitle = signal("Panel principal");

//Computed
export const sidebarTranslate = computed(() =>
  sidebarOpen.value ? "translate-x-0" : "-translate-x-full",
);

//Acciones UI
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

//Hook que conecta efectos del DOM
export function useLayout() {
  const userMenuRef = useRef<HTMLDivElement>(null);

  //Bloquea scroll cuando sidebar está abierto en móvil
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

  return {
    //UI
    userMenuRef,
    sidebarOpen,
    userMenuOpen,
    pageTitle,
    pageSubtitle,
    sidebarTranslate,
    openSidebar,
    closeSidebar,
    toggleUserMenu,
    setPageTitle,
    //Auth
    user: authUser,
    userName,
    userRol,
    userCargo,
    userEstado,
    isAuthenticated: computed(() => authUser.value !== null),
    logout,
  };
}