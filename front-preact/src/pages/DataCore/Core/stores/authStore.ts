import { signal, computed } from "@preact/signals";

export interface AuthUser {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  cargo: string;
  estado: "activo" | "inactivo" | "suspendido";
  token: string;
}

//Helpers de persistencia
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
export function login(user: AuthUser) {
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