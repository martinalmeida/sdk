import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { authService, LoginPayload } from "../services/authService";
import { loginFromResponse, logout as logoutStore } from "../stores";

export function useAuth() {
  const { route } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(payload: LoginPayload): Promise<boolean> {
    setLoading(true);
    setError(null);

    const loginRes = await authService.login(payload);
    if (loginRes.error || !loginRes.data) {
      setError(loginRes.error ?? "Error al iniciar sesión");
      setLoading(false);
      return false;
    }

    const meRes = await authService.me(loginRes.data.access_token);
    if (meRes.error || !meRes.data) {
      setError("Error al obtener el perfil del usuario");
      setLoading(false);
      return false;
    }

    loginFromResponse(loginRes.data, meRes.data);
    setLoading(false);
    route("/base");
    return true;
  }

  async function handleLogout(): Promise<void> {
    await authService.logout();
    logoutStore();
    route("/");
  }

  return { login, handleLogout, loading, error, setError };
}
