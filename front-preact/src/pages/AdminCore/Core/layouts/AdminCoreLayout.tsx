import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  LayoutGrid,
  X,
} from "lucide-preact";
import AvatarComponent from "../components/AvatarComponent";
import { useLayout } from "../hooks";

interface Props {
  children: ComponentChildren;
}

export function AdminCoreLayout({ children }: Props) {
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
    singOut,
    activeProgram,
    baseUrl,
    activeMenuItemLabel,
    isMobile,
    closeSidebar,
    openSidebar,
    toggleUserMenu,
  } = useLayout();

  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

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
          class={`fixed inset-y-0 left-0 z-40 flex w-[84vw] max-w-[290px] flex-col border-r border-stone-200 bg-white transition-all duration-200 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
            desktopSidebarCollapsed ? "lg:w-[84px]" : "lg:w-[240px]"
          } ${sidebarTranslate.value}`}
        >
          {/* Header sidebar */}
          <div
            class={`flex h-14 items-center gap-3 border-b border-stone-200 px-4 ${
              desktopSidebarCollapsed ? "lg:justify-center lg:px-3" : ""
            }`}
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: activeProgram.value.accentColor }}
            >
              <activeProgram.value.icon
                size={18}
                strokeWidth={1.5}
                color="white"
                class="text-white"
              />
            </div>

            <div
              class={`min-w-0 ${desktopSidebarCollapsed ? "lg:hidden" : ""}`}
            >
              <p class="truncate text-[15px] font-bold tracking-tight text-stone-900">
                {activeProgram.value.label}
              </p>
              <p class="truncate text-[11.5px] text-stone-400">
                {activeProgram.value.description}
              </p>
            </div>

            <span
              class={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                desktopSidebarCollapsed ? "lg:hidden" : ""
              }`}
              style={{
                backgroundColor: activeProgram.value.badgeBg,
                color: activeProgram.value.badgeText,
              }}
            >
              {activeProgram.value.version}
            </span>

            <button
              class="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-600 lg:hidden"
              onClick={closeSidebar}
              aria-label="Cerrar menú lateral"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navegación dinámica con los menús del programa activo */}
          <nav class="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
            <div
              class={`mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[.08em] text-stone-400 ${
                desktopSidebarCollapsed ? "lg:hidden" : ""
              }`}
            >
              Principal
            </div>

            {activeProgram.value.menus?.map((item) => {
              const href = baseUrl.value + item.href;
              const isActive = activeMenuItemLabel.value === item.label;
              return (
                <a
                  key={item.label}
                  href={href}
                  class={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    if (isMobile) closeSidebar();
                  }}
                >
                  <span class="nav-ico">
                    <item.icon size={16} />
                  </span>
                  <span
                    class={`nav-txt ${
                      desktopSidebarCollapsed ? "lg:hidden" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Footer sidebar — datos del usuario */}
          <div class="h-14 border-t border-stone-200 bg-stone-50 px-3">
            <div
              class={`flex h-full items-center gap-3 rounded-xl px-3 ${
                desktopSidebarCollapsed ? "lg:justify-center lg:px-0" : ""
              }`}
            >
              <AvatarComponent name={userName.value} />
              <div
                class={`min-w-0 flex-1 ${
                  desktopSidebarCollapsed ? "lg:hidden" : ""
                }`}
              >
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

        <div class="flex min-w-0 flex-1 flex-col">
          <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-stone-200 bg-white px-3 sm:px-4">
            <button
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 lg:hidden"
              onClick={openSidebar}
              aria-label="Abrir menú lateral"
            >
              <Menu size={18} />
            </button>

            <button
              class="hidden h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 lg:inline-flex"
              onClick={() => setDesktopSidebarCollapsed((v) => !v)}
              aria-label="Alternar menú lateral"
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

              <div class="relative" ref={userMenuRef}>
                <button
                  class="flex items-center gap-1 rounded-lg px-2 py-1 text-stone-600 hover:bg-stone-100"
                  onClick={toggleUserMenu}
                >
                  <AvatarComponent name={userName.value} />
                  <ChevronDown
                    size={12}
                    class={`transition-transform duration-200 ${
                      userMenuOpen.value ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen.value && (
                  <div class="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                    <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-stone-700 hover:bg-stone-50">
                      <User size={14} />
                      Mi perfil
                    </button>
                    <a
                      href="/base"
                      class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-stone-700 hover:bg-stone-50"
                    >
                      <LayoutGrid size={14} />
                      Programas
                    </a>
                    <div class="my-1 h-px bg-stone-200" />
                    <button
                      onClick={singOut}
                      class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
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
