import { LogOut, ExternalLink, Lock } from "lucide-preact";
import { useAuth } from "../Auth/hooks";
import { authUser } from "../Auth/stores";
import { ComponentChildren } from "preact";

interface ProgramConfig {
  label: string;
  description: string;
  version: string;
  accentColor: string;
  bgFrom: string;
  bgTo: string;
  badgeBg: string;
  badgeText: string;
  icon: ComponentChildren;
  url: string;
  available: boolean;
}

const PROGRAMS: Record<string, ProgramConfig> = {
  "data-core": {
    label: "DataCore",
    description:
      "Analítica estadística y big data para empresas multidepartamentales",
    version: "v0.1",
    accentColor: "#cc8b3c",
    bgFrom: "#fef7ed",
    bgTo: "#fef3e2",
    badgeBg: "rgba(251,191,36,0.15)",
    badgeText: "#92400e",
    url: "/data-core",
    available: true,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#cc8b3c"
        stroke-width="1.8"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  "help-core": {
    label: "HelpCore",
    description:
      "Gestión de tickets de soporte para equipos multidepartamentales",
    version: "v0.1",
    accentColor: "#2563eb",
    bgFrom: "#eef4ff",
    bgTo: "#e0ecff",
    badgeBg: "rgba(59,130,246,0.12)",
    badgeText: "#1e40af",
    url: "/help-core",
    available: false,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563eb"
        stroke-width="1.8"
      >
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path
          d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
          stroke-linecap="round"
        />
      </svg>
    ),
  },
  admin: {
    label: "AdminCore",
    description:
      "Administración de usuarios, roles, permisos y programas de la suite",
    version: "v0.1",
    accentColor: "#7c3aed",
    bgFrom: "#f5f3ff",
    bgTo: "#ede9fe",
    badgeBg: "rgba(124,58,237,0.12)",
    badgeText: "#5b21b6",
    url: "/admin",
    available: true,
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#7c3aed"
        stroke-width="1.8"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round" />
      </svg>
    ),
  },
};

function ProgramCard({ config }: { config: ProgramConfig }) {
  const button = config.available ? (
    <a
      href={config.url}
      class="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-opacity active:scale-[0.98]"
      style={{ background: config.accentColor }}
    >
      Ingresar
      <ExternalLink size={13} />
    </a>
  ) : (
    <div class="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-stone-400 bg-stone-100 cursor-not-allowed">
      <Lock size={13} />
      No disponible aún
    </div>
  );

  return (
    <div
      class="relative rounded-2xl border border-stone-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${config.bgFrom} 0%, ${config.bgTo} 100%)`,
      }}
    >
      <div
        class="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: config.accentColor,
          opacity: 0.08,
          filter: "blur(40px)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div class="relative p-6">
        <div class="flex items-start justify-between mb-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm"
            style={{ border: `1px solid ${config.accentColor}22` }}
          >
            {config.icon}
          </div>
          <div class="flex items-center gap-2">
            <span
              class="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide"
              style={{ background: config.badgeBg, color: config.badgeText }}
            >
              {config.version}
            </span>
            {!config.available && (
              <span class="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-400">
                <Lock size={9} />
                Pronto
              </span>
            )}
          </div>
        </div>

        <h3 class="text-[18px] font-bold tracking-tight text-stone-900 mb-1.5">
          {config.label}
        </h3>
        <p class="text-[12.5px] text-stone-500 leading-relaxed mb-5">
          {config.description}
        </p>

        {button}
      </div>
    </div>
  );
}

export default function Base() {
  const { handleLogout } = useAuth();
  const user = authUser.value;

  if (!user) {
    window.location.href = "/";
    return null;
  }

  const isSuperAdmin = user.rol === "Super Administrador";
  const activeSlugs = user.programs
    .filter((p) => p.is_active)
    .map((p) => p.slug);
  const allSlugs = isSuperAdmin ? [...activeSlugs, "admin"] : activeSlugs;
  const programs = allSlugs
    .map((slug) => ({ slug, config: PROGRAMS[slug] }))
    .filter(
      (p): p is { slug: string; config: ProgramConfig } =>
        p.config !== undefined,
    );

  const gridCols =
    programs.length === 1
      ? "1fr"
      : programs.length === 2
        ? "repeat(2, 1fr)"
        : programs.length <= 4
          ? "repeat(2, 1fr)"
          : "repeat(3, 1fr)";

  const maxWidth =
    programs.length === 1 ? "400px" : programs.length === 2 ? "720px" : "960px";

  return (
    <div
      class="min-h-dvh flex flex-col"
      style={{
        background: "linear-gradient(135deg, #fafaf9 0%, #f5f4f0 100%)",
      }}
    >
      <div
        class="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e7e5e0 1px, transparent 1px), linear-gradient(90deg, #e7e5e0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.25,
        }}
      />

      <header class="relative z-10 flex items-center justify-between px-6 py-4 border-b border-stone-200/60 bg-white/50 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="GA Suite" class="h-8 w-8 object-contain" />
          <div>
            <p class="text-[14px] font-bold tracking-tight text-stone-900">
              GoAlrCore Suite
            </p>
            <p class="text-[10.5px] text-stone-400 font-mono">
              Plataforma empresarial
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 rounded-full bg-white border border-stone-200 px-3 py-1.5">
            <span
              class="h-1.5 w-1.5 rounded-full bg-green-500"
              style={{ boxShadow: "0 0 6px #22c55e" }}
            />
            <span class="text-[11.5px] text-stone-600 font-medium">
              {user.nombre}
            </span>
            <span class="text-stone-300">·</span>
            <span class="text-[11px] text-stone-400">
              {user.cargo || user.rol}
            </span>
          </div>
          <button
            onClick={handleLogout}
            class="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11.5px] font-medium text-stone-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
          >
            <LogOut size={12} />
            <span class="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div class="text-center mb-10">
          <p class="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Selecciona un entorno
          </p>
          <h1 class="text-[28px] font-bold tracking-tight text-stone-900">
            ¿A dónde vas hoy?
          </h1>
        </div>

        <div
          class="w-full grid gap-4"
          style={{ gridTemplateColumns: gridCols, maxWidth }}
        >
          {programs.map(({ slug, config }) => (
            <ProgramCard key={slug} config={config} />
          ))}
        </div>
      </main>

      <footer class="relative z-10 text-center py-4 border-t border-stone-200/40">
        <p class="font-mono text-[10.5px] text-stone-300">
          GA Suite · {new Date().getFullYear()} · Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
