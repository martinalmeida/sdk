import { useEffect } from "preact/hooks";
import { setPageTitle } from "../Core/hooks/useLayout";
import {
  Users,
  ShieldCheck,
  Settings,
  Key,
  UserPlus,
  ArrowRight,
} from "lucide-preact";
import NoticeComponent from "../Core/components/NoticeComponent";
import StatsComponent from "../Core/components/StatsComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import { useUsers } from "../Users/hooks";
import { useRoles } from "../Roles/hooks";
import { usePrograms } from "../Programs/hooks";
import { usePermissions } from "../Permissions/hooks";
import { useGroups } from "../Groups/hooks";

export default function Home() {
  const { users, loading: usersLoading } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { programs, loading: programsLoading } = usePrograms();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const { groups, loading: groupsLoading } = useGroups();

  const isLoading =
    usersLoading ||
    rolesLoading ||
    programsLoading ||
    permissionsLoading ||
    groupsLoading;

  useEffect(() => {
    setPageTitle("Dashboard", "Panel de administración general");
  }, []);

  if (isLoading) {
    return <LoaderComponent message="Cargando estadísticas del sistema..." />;
  }

  const stats = [
    {
      label: "Usuarios activos",
      value: users.filter((u) => u.status === "active").length.toString(),
      valueTone: "text-green-700",
      badge: `+${users.filter((u) => u.status === "active").length} activos`,
      badgeClass: "bg-green-100 text-green-700",
      note: "del total registrados",
    },
    {
      label: "Roles del sistema",
      value: roles.length.toString(),
      valueTone: "text-blue-700",
      badge: `${roles.filter((r) => r.is_global).length} globales`,
      badgeClass: "bg-blue-100 text-blue-700",
      note: "distribuidos entre programas",
    },
    {
      label: "Programas activos",
      value: programs.filter((p) => p.is_active).length.toString(),
      valueTone: "text-purple-700",
      badge: `${programs.length} totales`,
      badgeClass: "bg-purple-100 text-purple-700",
    },
    {
      label: "Permisos definidos",
      value: permissions.length.toString(),
      valueTone: "text-amber-700",
      badge: `${permissions.filter((p) => p.program_id === null).length} globales`,
      badgeClass: "bg-amber-100 text-amber-700",
      note: "asignables a roles",
    },
    {
      label: "Grupos creados",
      value: groups.length.toString(),
      valueTone: "text-rose-700",
      badge: `${groups.reduce((acc, g) => acc + (g.users?.length || 0), 0)} miembros totales`,
      badgeClass: "bg-rose-100 text-rose-700",
      note: "equipos de trabajo",
    },
  ];

  const modules = [
    {
      title: "Usuarios",
      description:
        "Gestiona usuarios, asigna programas y roles, revisa permisos.",
      icon: Users,
      href: "/admin-core/usuarios",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Roles",
      description:
        "Crea roles globales o por programa. Define etiquetas y permisos base.",
      icon: ShieldCheck,
      href: "/admin-core/roles",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Programas",
      description:
        "Administra los submódulos de la suite (DataCore, HelpCore, etc.).",
      icon: Settings,
      href: "/admin-core/programas",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Permisos",
      description: "Gestiona los permisos del sistema (CRUD completo).",
      icon: Key,
      href: "/admin-core/permisos",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Grupos",
      description: "Organiza usuarios por equipos, departamentos o categorías.",
      icon: UserPlus,
      href: "/admin-core/grupos",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const reminders = [
    {
      variant: "warning" as const,
      icon: "📌",
      title: "Usuarios sin programa asignado",
      description: `${users.filter((u) => u.programs.length === 0).length} usuarios no tienen ningún programa asignado. Edítelos y asígneles uno.`,
      link: "/admin-core/usuarios",
    },
    {
      variant: "info" as const,
      icon: "ℹ️",
      title: "Roles huérfanos",
      description: `${roles.filter((r) => !r.is_global && !r.program_id).length} roles no están vinculados a ningún programa.`,
      link: "/admin-core/roles",
    },
    {
      variant: "danger" as const,
      icon: "⚠️",
      title: "Permisos no usados",
      description: `${permissions.filter((p) => !p.program_id).length} permisos globales no han sido asignados a ningún rol.`,
      link: "/admin-core/permisos",
    },
    {
      variant: "warning" as const,
      icon: "👥",
      title: "Grupos sin miembros",
      description: `${groups.filter((g) => !g.users?.length).length} grupos no tienen usuarios asignados. Agrégueles miembros.`,
      link: "/admin-core/grupos",
    },
  ];

  return (
    <section class="space-y-6">
      <NoticeComponent
        variant="info"
        icon="🏠"
        title="Panel de administración"
        description="Desde aquí puede gestionar todos los aspectos del sistema: usuarios, roles, programas, permisos y grupos."
      />

      <StatsComponent items={stats} />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {modules.map((mod) => (
          <a
            key={mod.title}
            href={mod.href}
            class="group rounded-xl border border-stone-200 bg-white p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div
              class={`mb-3 inline-flex rounded-lg ${mod.bg} p-2.5 ${mod.color}`}
            >
              <mod.icon size={22} />
            </div>
            <h3 class="font-semibold text-stone-900">{mod.title}</h3>
            <p class="mt-1 text-[12px] text-stone-500">{mod.description}</p>
            <div class="mt-3 flex items-center text-[11px] font-medium text-[#7c3aed] group-hover:underline">
              Ir al módulo <ArrowRight size={12} class="ml-1" />
            </div>
          </a>
        ))}
      </div>

      <div class="rounded-xl border border-stone-200 bg-white p-4">
        <p class="mb-3 text-[13px] font-semibold text-stone-900">
          Alertas del sistema
        </p>
        <div class="space-y-2">
          {reminders.map((item) => (
            <NoticeComponent
              key={item.title}
              variant={item.variant}
              icon={item.icon}
              title={item.title}
              description={`${item.description} `}
            >
              {item.link && (
                <a
                  href={item.link}
                  class="ml-2 text-xs font-medium underline hover:opacity-80"
                >
                  Revisar →
                </a>
              )}
            </NoticeComponent>
          ))}
        </div>
      </div>
    </section>
  );
}
