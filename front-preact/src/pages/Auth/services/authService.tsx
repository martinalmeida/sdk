import { CoreApi } from "../../../tools/api";
import { authToken } from "../stores";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    status: string;
    cargo: string | null;
    position: string | null;
  };
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  status: string;
  cargo: string | null;
  position: string | null;
  programs: {
    id: number;
    name: string;
    slug: string;
    role: string;
    is_active: boolean;
    permissions: string[];
  }[];
}

export const authService = {
  login: (payload: LoginPayload) =>
    CoreApi.post<LoginResponse>("/login", payload),

  me: (token: string) => CoreApi.get<MeResponse>("/me", { token }),

  logout: () => CoreApi.post<void>("/logout", {}, { token: authToken.value }),

  logoutAll: () =>
    CoreApi.post<void>("/logout-all", {}, { token: authToken.value }),
};
