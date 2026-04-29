import { useState } from "preact/hooks";
import { authService, LoginPayload } from "../services/authService";
import { loginFromResponse, logout as logoutStore } from "../stores";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(payload: LoginPayload): Promise<boolean> {
    setLoading(true);
    setError(null);

    //Login
    const loginRes = await authService.login(payload);

    if (loginRes.error || !loginRes.data) {
      setError(loginRes.error ?? "Error al iniciar sesión");
      setLoading(false);
      return false;
    }

    //Obtener perfil completo con programas y permisos
    const meRes = await authService.me();

    if (meRes.error || !meRes.data) {
      setError("Error al obtener el perfil del usuario");
      setLoading(false);
      return false;
    }

    //Guardar en store
    loginFromResponse(loginRes.data, meRes.data);

    setLoading(false);
    return true;
  }

  async function handleLogout(): Promise<void> {
    await authService.logout();
    logoutStore();
  }

  return { login, handleLogout, loading, error, setError };
}
