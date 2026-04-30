import type { ComponentType } from "preact";
import {
  BarChart3,
  LifeBuoy,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
} from "lucide-preact";
import type { LucideProps } from "lucide-preact";

export type ProgramIcon = ComponentType<LucideProps>;

export interface MenuItem {
  label: string;
  href: string;
  icon: ProgramIcon;
  matchExact?: boolean;
}

export interface ProgramConfig {
  label: string;
  description: string;
  version: string;
  accentColor: string;
  bgFrom: string;
  bgTo: string;
  badgeBg: string;
  badgeText: string;
  icon: ProgramIcon;
  url: string;
  available: boolean;
  menus: MenuItem[];
}

export const PROGRAMS: Record<string, ProgramConfig> = {
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
    icon: BarChart3,
    menus: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        matchExact: true,
      },
      {
        label: "Usuarios",
        href: "/usuarios",
        icon: FileText,
      },
    ],
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
    icon: LifeBuoy,
    menus: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        matchExact: true,
      },
      {
        label: "Tickets",
        href: "/tickets",
        icon: FileText,
      },
    ],
  },
  "admin-core": {
    label: "AdminCore",
    description:
      "Administración de usuarios, roles, permisos y programas de la suite",
    version: "v0.1",
    accentColor: "#7c3aed",
    bgFrom: "#f5f3ff",
    bgTo: "#ede9fe",
    badgeBg: "rgba(124,58,237,0.12)",
    badgeText: "#5b21b6",
    url: "/admin-core",
    available: true,
    icon: ShieldCheck,
    menus: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        matchExact: true,
      },
      {
        label: "Usuarios",
        href: "/usuarios",
        icon: Users,
      },
      {
        label: "Programas",
        href: "/programas",
        icon: Settings,
      },
    ],
  },
};
