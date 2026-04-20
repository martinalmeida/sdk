import { useLocation } from "preact-iso";
import { ArrowLeft } from "lucide-preact";

export function NotFound() {
  const { route } = useLocation();

  return (
    <section class="flex h-dvh w-full items-center justify-center bg-stone-50 overflow-hidden">
      <div class="flex flex-col items-center gap-5 px-6 text-center max-w-[420px] w-full">
        {/* Ilustración flotante */}
        <div
          class="relative"
          style={{ animation: "float 2.5s ease-in-out infinite" }}
        >
          <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
          <div class="relative flex h-[80px] w-[100px] flex-col rounded-xl border border-amber-300 bg-amber-50 overflow-hidden">
            <div class="flex h-[14px] w-full items-center gap-1.5 bg-amber-200 px-2">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-800 opacity-70" />
              <span class="h-1.5 w-1.5 rounded-full bg-amber-800 opacity-70" />
              <span class="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>
            <div class="flex flex-col gap-1.5 p-2.5">
              <div class="h-1.5 w-[40px] rounded bg-amber-200" />
              <div class="h-1.5 w-[28px] rounded bg-amber-200" />
              <div class="h-1.5 w-[36px] rounded bg-amber-200" />
            </div>
            <span class="absolute bottom-1 right-2 text-[22px] font-bold leading-none text-amber-600">
              ?
            </span>
          </div>
          <span class="absolute -right-2 -top-2 rounded-md bg-red-100 px-1.5 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
            404
          </span>
        </div>

        {/* Texto */}
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[.08em] text-stone-400">
            <span class="h-px w-5 bg-stone-300" />
            Registro no encontrado
            <span class="h-px w-5 bg-stone-300" />
          </div>
          <h1 class="text-[22px] font-bold tracking-tight text-stone-900 leading-tight">
            Esta página no existe
          </h1>
          <p class="text-[13px] leading-relaxed text-stone-400">
            La ruta que intentas abrir no está registrada.
            <br />
            Puede que haya sido movida o nunca existió.
          </p>
        </div>

        {/* Terminal pill */}
        <div class="flex flex-wrap items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono text-[11px] text-stone-400">
          <span class="text-amber-600">$</span>
          <span class="text-stone-500">GET</span>
          <span class="text-red-500">/ruta-no-registrada</span>
          <span>→</span>
          <span class="font-semibold text-red-600">404</span>
          <span class="inline-block h-3 w-1.5 animate-pulse rounded-sm bg-[#cc8b3c]" />
        </div>

        {/* Botones */}
        <div class="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => history.back()}
            class="inline-flex items-center gap-2 rounded-xl bg-[#cc8b3c] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#b5782f] transition-colors"
          >
            <ArrowLeft size={14} />
            Volver atrás
          </button>
          <button
            onClick={() => route("/")}
            class="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-[13px] text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Ir al inicio
          </button>
        </div>

        <p class="text-[11px] text-stone-400">
          ¿Crees que esto es un error? Contacta al administrador del sistema.
        </p>
      </div>
    </section>
  );
}
