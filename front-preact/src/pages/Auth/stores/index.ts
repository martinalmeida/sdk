import { signal, computed } from "@preact/signals";
import type { MeResponse, LoginResponse } from "../services/authService";

export interface AuthUser {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  cargo: string;
  estado: "active" | "inactive" | "suspended";
  token: string;
  programs: MeResponse["programs"];
  permissions: string[]; //permisos del programa activo
}

const STORAGE_KEY = "auth_session";

function loadFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function saveToStorage(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

//Signals
export const authUser = signal<AuthUser | null>(loadFromStorage());

//Computed
export const isAuthenticated = computed(() => authUser.value !== null);
export const authToken = computed(() => authUser.value?.token ?? null);
export const userName = computed(() => authUser.value?.nombre ?? "");
export const userRol = computed(() => authUser.value?.rol ?? "");
export const userCargo = computed(() => authUser.value?.cargo ?? "");
export const userEstado = computed(() => authUser.value?.estado ?? null);

//Acciones
export function loginFromResponse(
  loginRes: LoginResponse,
  meRes: MeResponse,
  programSlug = "data-core",
): void {
  const program = meRes.programs.find((p) => p.slug === programSlug);

  const user: AuthUser = {
    id: meRes.id,
    nombre: meRes.name,
    correo: meRes.email,
    rol: program?.role ?? "Sin rol",
    cargo: meRes.cargo ?? meRes.position ?? "",
    estado: meRes.status as AuthUser["estado"],
    token: loginRes.access_token,
    programs: meRes.programs,
    permissions: program?.permissions ?? [],
  };

  authUser.value = user;
  saveToStorage(user);
}

export function logout() {
  authUser.value = null;
  saveToStorage(null);
}

export function updateUser(partial: Partial<AuthUser>) {
  if (!authUser.value) return;
  authUser.value = { ...authUser.value, ...partial };
  saveToStorage(authUser.value);
}

export function hasPermission(permission: string): boolean {
  return authUser.value?.permissions.includes(permission) ?? false;
}
