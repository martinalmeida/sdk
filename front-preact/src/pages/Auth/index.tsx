import { useState } from "preact/hooks";
import { Eye, EyeOff } from "lucide-preact";
import { useAuth } from "./hooks";

export default function index() {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    await login({ email, password });
  }

  return (
    <section
      class="flex h-dvh w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fafaf9 0%, #f5f4f0 60%, #fef7ed 100%)",
      }}
    >
      {/* Grid decorativo */}
      <div
        class="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e7e5e0 1px, transparent 1px), linear-gradient(90deg, #e7e5e0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      {/* Panel izquierdo — branding */}
      <div class="hidden lg:flex flex-col items-center justify-center flex-1 px-16 relative">
        <div class="max-w-sm text-center">
          <img
            src="/logo.png"
            alt="GoAltCore Suite"
            class="w-40 h-40 object-contain mx-auto mb-8 drop-shadow-sm"
          />
          <h1 class="text-[32px] font-bold tracking-tight text-stone-900 mb-3">
            GoAltCore Suite
          </h1>
          <p class="text-[14px] text-stone-500 leading-relaxed">
            Plataforma empresarial integrada para la gestión de datos, soporte y
            operaciones multidepartamentales.
          </p>

          {/* Decoración de programas */}
          <div class="mt-10 flex flex-col gap-2">
            {[
              {
                name: "DataCore",
                desc: "Analítica estadística",
                color: "#cc8b3c",
                dot: "bg-amber-400",
              },
              {
                name: "HelpCore",
                desc: "Soporte y tickets",
                color: "#2563eb",
                dot: "bg-blue-500",
              },
              {
                name: "AdminCore",
                desc: "Gestión de la suite",
                color: "#7c3aed",
                dot: "bg-violet-500",
              },
            ].map(({ name, desc, dot }) => (
              <div
                key={name}
                class="flex items-center gap-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 px-4 py-2.5 text-left"
              >
                <span class={`h-2 w-2 rounded-full shrink-0 ${dot}`} />
                <div>
                  <p class="text-[12.5px] font-semibold text-stone-800">
                    {name}
                  </p>
                  <p class="text-[11px] text-stone-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divisor vertical */}
      <div class="hidden lg:block w-px bg-stone-200 self-stretch my-8" />

      {/* Panel derecho — formulario */}
      <div class="flex flex-col items-center justify-center flex-1 px-6 lg:px-16">
        {/* Logo solo en móvil */}
        <div class="lg:hidden mb-8 flex flex-col items-center gap-2">
          <img
            src="/logo.png"
            alt="GoAltCore Suite"
            class="w-20 h-20 object-contain"
          />
          <p class="text-[16px] font-bold text-stone-900">GoAltCore Suite</p>
        </div>

        <div class="w-full max-w-[360px]">
          <div class="mb-7">
            <h2 class="text-[22px] font-bold tracking-tight text-stone-900">
              Bienvenido de vuelta
            </h2>
            <p class="text-[13px] text-stone-400 mt-1">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} class="space-y-4">
            {error && (
              <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] text-red-700">
                {error}
              </div>
            )}

            <div>
              <label class="mb-1.5 block text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider">
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
                class="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-[13.5px] text-stone-800 outline-none transition-all placeholder:text-stone-300 focus:border-stone-400 focus:ring-3 focus:ring-stone-100"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-[11.5px] font-semibold text-stone-500 uppercase tracking-wider">
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
                  class="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-11 text-[13.5px] text-stone-800 outline-none transition-all placeholder:text-stone-300 focus:border-stone-400 focus:ring-3 focus:ring-stone-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full rounded-xl bg-stone-900 py-3 text-[14px] font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? "Verificando credenciales…" : "Ingresar al sistema"}
            </button>
          </form>

          <p class="mt-8 text-center font-mono text-[10.5px] text-stone-300">
            GoAltCore Suite · Plataforma empresarial
          </p>
        </div>
      </div>
    </section>
  );
}
