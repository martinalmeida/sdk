import { ComponentChildren } from "preact";
import {
  Monitor,
  FileText,
  LayoutDashboard,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
} from "lucide-preact";
import AvatarComponent from "../components/AvatarComponent";
import { useLayout, openSidebar, closeSidebar, toggleUserMenu } from "../hooks";

interface Props {
  children: ComponentChildren;
}

export function DataCoreLayout({ children }: Props) {
  const {
    userMenuRef,
    sidebarOpen,
    userMenuOpen,
    pageTitle,
    pageSubtitle,
    sidebarTranslate,
    userName,
    userCargo,
    userRol,
    logout,
  } = useLayout();

  return (
    <section class="h-dvh overflow-hidden">
      <div class="flex h-dvh overflow-hidden">
        {/* Backdrop móvil */}
        {sidebarOpen.value && (
          <div
            class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <aside
          class={`fixed inset-y-0 left-0 z-40 flex w-[84vw] max-w-[290px] flex-col border-r border-stone-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-dvh lg:w-[240px] lg:translate-x-0 ${sidebarTranslate.value}`}
        >
          {/* Header sidebar */}
          <div class="flex h-14 items-center gap-3 border-b border-stone-200 px-4">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#cc8b3c]">
              <Monitor size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div class="min-w-0">
              <p class="truncate text-[15px] font-bold tracking-tight text-stone-900">
                DataCore
              </p>
              <p class="truncate text-[11.5px] text-stone-400">
                Panel Estadístico
              </p>
            </div>
            <span class="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              v0.1
            </span>
            <button
              class="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-600 lg:hidden"
              onClick={closeSidebar}
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav class="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
            <div class="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[.08em] text-stone-400">
              Principal
            </div>
            <button class="nav-item active" onClick={closeSidebar}>
              <span class="nav-ico">
                <LayoutDashboard size={16} />
              </span>
              <a href="/data-core" class="nav-txt">
                Dashboard
              </a>
            </button>
            <button class="nav-item" onClick={closeSidebar}>
              <span class="nav-ico">
                <FileText size={16} />
              </span>
              <a href="/data-core/usuarios" class="nav-txt">
                Usuarios
              </a>
            </button>
          </nav>

          {/* Footer sidebar — datos del usuario */}
          <div class="border-t border-stone-200 h-14 px-3 bg-stone-50">
            <div class="flex h-full items-center gap-3 rounded-xl px-3">
              <AvatarComponent name={userName.value} />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[13px] font-medium text-stone-900">
                  {userName.value || "Usuario"}
                </p>
                <p class="truncate text-[11.5px] text-stone-400">
                  {userCargo.value || "—"} · {userRol.value || "—"}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div class="flex flex-1 flex-col min-w-0">
          {/* Header principal */}
          <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-stone-200 bg-white px-3 sm:px-4">
            <button
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 lg:hidden"
              onClick={openSidebar}
            >
              <Menu size={18} />
            </button>

            <div class="min-w-0">
              <p class="truncate text-[14px] font-semibold text-stone-900">
                {pageTitle.value}
              </p>
              <p class="hidden text-[11.5px] text-stone-400 sm:block">
                {pageSubtitle.value}
              </p>
            </div>

            <div class="ml-auto flex items-center gap-2">
              <span class="hidden rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700 sm:inline-flex">
                ● Sistema activo
              </span>

              <button class="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100">
                <Bell size={16} />
                <span class="absolute right-[6px] top-[6px] h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* Menú usuario */}
              <div class="relative" ref={userMenuRef}>
                <button
                  class="flex items-center gap-1 rounded-lg px-2 py-1 text-stone-600 hover:bg-stone-100"
                  onClick={toggleUserMenu}
                >
                  <AvatarComponent name={userName.value} />
                  <ChevronDown
                    size={12}
                    class={`transition-transform duration-200 ${userMenuOpen.value ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen.value && (
                  <div class="absolute right-0 top-full mt-1 min-w-[160px] rounded-xl border border-stone-200 bg-white py-1 shadow-lg z-50">
                    <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-stone-700 hover:bg-stone-50 rounded-lg">
                      <User size={14} />
                      Mi perfil
                    </button>
                    <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-stone-700 hover:bg-stone-50 rounded-lg">
                      <Settings size={14} />
                      Ajustes de cuenta
                    </button>
                    <div class="my-1 h-px bg-stone-200" />
                    <button
                      onClick={logout}
                      class="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={14} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main class="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
            {children}
          </main>
        </div>
      </div>
    </section>
  );
}