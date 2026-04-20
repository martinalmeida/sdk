import { ComponentChildren } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import {
    Monitor, FileText, LayoutDashboard, Bell, Menu,
    ChevronDown, LogOut, User, Settings, X
} from 'lucide-preact';

import AvatarComponent from '../components/AvatarComponent';

interface Props {
    children: ComponentChildren;
}

export function DataCoreLayout({ children }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    //Cierra el menú de usuario al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    //Bloquea scroll del body cuando el sidebar está abierto en móvil
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <section class="h-dvh overflow-hidden">
            <div class="flex h-dvh overflow-hidden">

                {/* Backdrop móvil */}
                {sidebarOpen && (
                    <div
                        class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
                        onClick={closeSidebar}
                    />
                )}

                <aside
                    id="sidebar"
                    class={`fixed inset-y-0 left-0 z-40 flex w-[84vw] max-w-[290px] flex-col border-r border-stone-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-dvh lg:w-[240px] lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div class="flex h-14 items-center gap-3 border-b border-stone-200 px-4">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#cc8b3c]">
                            <Monitor size={14} color="#fff" strokeWidth={2.5} />
                        </div>

                        <div class="min-w-0">
                            <p class="truncate text-[15px] font-bold tracking-tight text-stone-900">
                                DataCore
                            </p>
                            <p class="truncate text-[11.5px] text-stone-400">
                                Panel Estadistico
                            </p>
                        </div>

                        <span class="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            v0.1
                        </span>

                        {/* Botón cerrar sidebar en móvil */}
                        <button
                            class="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-600 lg:hidden"
                            onClick={closeSidebar}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <nav class="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
                        <div class="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[.08em] text-stone-400">
                            Principal
                        </div>

                        <button class="nav-item active" onClick={closeSidebar}>
                            <span class="nav-ico">
                                <LayoutDashboard size={16} />
                            </span>
                            <a href="/data-core" class="nav-txt">Dashboard</a>
                        </button>

                        <button class="nav-item" onClick={closeSidebar}>
                            <span class="nav-ico">
                                <FileText size={16} />
                            </span>
                            <a href="/data-core/usuarios" class="nav-txt">Usuarios</a>
                            {/* <span class="nav-badge bg-red-100 text-red-700">3</span> */}
                        </button>
                    </nav>

                    <div class="border-t border-stone-200 h-14 px-3 bg-stone-50">
                        <div class="flex h-full items-center gap-3 rounded-xl px-3">
                            <AvatarComponent name="Usuario" />
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-[13px] font-medium text-stone-900">
                                    Usuario
                                </p>
                                <p class="truncate text-[11.5px] text-stone-400">
                                    Cargo · Rol
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div class="flex flex-1 flex-col min-w-0">
                    <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-stone-200 bg-white px-3 sm:px-4">

                        {/* Botón hamburguesa */}
                        <button
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={18} />
                        </button>

                        <div class="min-w-0">
                            <p id="tb-title" class="truncate text-[14px] font-semibold text-stone-900">
                                Dashboard
                            </p>
                            <p class="hidden text-[11.5px] text-stone-400 sm:block">
                                Panel principal
                            </p>
                        </div>

                        <div class="ml-auto flex items-center gap-2">
                            <span class="hidden rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700 sm:inline-flex">
                                ● Sistema activo
                            </span>

                            <button class="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100">
                                <Bell size={16} />
                                <span class="absolute right-[6px] top-[6px] h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>

                            {/* Menú usuario */}
                            <div class="relative" ref={userMenuRef}>
                                <button
                                    class="flex items-center gap-1 rounded-lg px-2 py-1 text-stone-600 hover:bg-stone-100"
                                    onClick={() => setUserMenuOpen(prev => !prev)}
                                >
                                    <AvatarComponent name="Usuario" />
                                    <ChevronDown
                                        size={12}
                                        class={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <div class="dd-menu absolute right-0 top-full mt-1 min-w-[160px] rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                                        <button class="dd-item flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-stone-700 hover:bg-stone-50">
                                            <User size={14} />
                                            Mi perfil
                                        </button>
                                        <button class="dd-item flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-stone-700 hover:bg-stone-50">
                                            <Settings size={14} />
                                            Ajustes de cuenta
                                        </button>
                                        <div class="my-1 h-px bg-stone-200"></div>
                                        <a href="/" class="dd-item danger flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50">
                                            <LogOut size={14} />
                                            Cerrar sesión
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <main
                        id="main-scroll"
                        class="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 sm:px-4 sm:py-5 lg:px-6"
                    >
                        {children}
                    </main>
                </div>
            </div>
        </section>
    );
}