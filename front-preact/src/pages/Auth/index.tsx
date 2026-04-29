import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Eye, EyeOff, Monitor } from "lucide-preact";
import { useAuth } from "./hooks";

export default function index() {
  const { route } = useLocation();
  const { login, loading, error, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) route("/data-core");
  }

  return (
    <section class="flex h-dvh w-full items-center justify-center bg-stone-50 overflow-hidden">
      {/* Grid decorativo */}
      <div
        class="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(#e7e5e0 1px, transparent 1px), linear-gradient(90deg, #e7e5e0 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div class="relative w-full max-w-[380px] px-4">
        <div class="rounded-2xl border border-stone-200 bg-white shadow-sm">
          {/* Header */}
          <div class="flex flex-col items-center gap-3 border-b border-stone-200 px-6 py-6">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#cc8b3c]">
              <Monitor size={22} color="#fff" strokeWidth={2} />
            </div>
            <div class="text-center">
              <p class="text-[17px] font-bold tracking-tight text-stone-900">
                DataCore Suite
              </p>
              <p class="text-[12.5px] text-stone-400">
                Inicia sesión para continuar
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-4 px-6 py-6">
            {/* Error global */}
            {error && (
              <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12.5px] text-red-700">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label class="mb-1 block text-[12.5px] font-medium text-stone-600">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                placeholder="usuario@empresa.com"
                value={email}
                onInput={(e) => {
                  setEmail((e.target as HTMLInputElement).value);
                  setError(null);
                }}
                class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-[#cc8b3c] focus:ring-1 focus:ring-[#cc8b3c]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label class="mb-1 block text-[12.5px] font-medium text-stone-600">
                Contraseña
              </label>
              <div class="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onInput={(e) => {
                    setPassword((e.target as HTMLInputElement).value);
                    setError(null);
                  }}
                  class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 pr-10 text-[13px] outline-none transition-colors focus:border-[#cc8b3c] focus:ring-1 focus:ring-[#cc8b3c]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              class="w-full rounded-xl bg-[#cc8b3c] py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#b87830] disabled:opacity-60"
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>
        </div>

        {/* Version tag */}
        <p class="mt-4 text-center font-mono text-[11px] text-stone-400">
          DataCore v0.1 · Suite empresarial
        </p>
      </div>
    </section>
  );
}
