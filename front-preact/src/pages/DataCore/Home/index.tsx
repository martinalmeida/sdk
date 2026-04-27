import { login } from "../Core/stores";

//Simulacion de login
login({
  id: 1,
  nombre: "Juan Díaz",
  correo: "juan@empresa.com",
  rol: "Administrador",
  cargo: "Contador",
  estado: "activo",
  token: "eyJ...",
});

export default function index() {
  return (
    <>
      <section id="sec-dashboard" class="space-y-4">
        <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>3 retenciones</strong> vencen el 20 de abril. Realice el pago
          antes de la fecha límite para evitar sanciones.
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-stone-200 bg-white p-4">
            <p class="text-[12px] text-stone-400">Ingresos del mes</p>
            <p class="mono mt-1 text-[22px] font-medium text-green-700">
              $48,320.00
            </p>
            <div class="mt-2 flex items-center gap-2 text-[11.5px] text-stone-400">
              <span class="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                ↑ 12.4%
              </span>
              <span>vs mes ant.</span>
            </div>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-4">
            <p class="text-[12px] text-stone-400">Egresos del mes</p>
            <p class="mono mt-1 text-[22px] font-medium text-red-700">
              $31,750.00
            </p>
            <div class="mt-2 flex items-center gap-2 text-[11.5px] text-stone-400">
              <span class="rounded-full bg-red-100 px-2 py-0.5 text-red-700">
                ↑ 3.1%
              </span>
              <span>vs mes ant.</span>
            </div>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-4">
            <p class="text-[12px] text-stone-400">Utilidad neta</p>
            <p class="mono mt-1 text-[22px] font-medium text-blue-700">
              $16,570.00
            </p>
            <div class="mt-2 flex items-center gap-2 text-[11.5px] text-stone-400">
              <span class="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                Margen 34%
              </span>
            </div>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-4">
            <p class="text-[12px] text-stone-400">Por cobrar</p>
            <p class="mono mt-1 text-[22px] font-medium text-amber-700">
              $9,100.00
            </p>
            <div class="mt-2 flex items-center gap-2 text-[11.5px] text-stone-400">
              <span class="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                7 facturas
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div class="rounded-xl border border-stone-200 bg-white p-4">
            <p class="mb-4 text-[13.5px] font-semibold text-stone-900">
              Indicadores clave · Abril 2025
            </p>
            <div class="space-y-4">
              <div>
                <div class="mb-1.5 flex justify-between text-[13px]">
                  <span class="text-stone-600">Liquidez corriente</span>
                  <span class="mono font-medium">1.87×</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-stone-200">
                  <div class="h-full w-[70%] rounded-full bg-green-600"></div>
                </div>
              </div>
              <div>
                <div class="mb-1.5 flex justify-between text-[13px]">
                  <span class="text-stone-600">Endeudamiento</span>
                  <span class="mono font-medium">34.2%</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-stone-200">
                  <div class="h-full w-[34%] rounded-full bg-amber-500"></div>
                </div>
              </div>
              <div>
                <div class="mb-1.5 flex justify-between text-[13px]">
                  <span class="text-stone-600">Margen EBITDA</span>
                  <span class="mono font-medium">28.5%</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-stone-200">
                  <div class="h-full w-[28%] rounded-full bg-blue-600"></div>
                </div>
              </div>
              <div>
                <div class="mb-1.5 flex justify-between text-[13px]">
                  <span class="text-stone-600">Rotación C×C</span>
                  <span class="mono font-medium">18.3 días</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-stone-200">
                  <div class="h-full w-[55%] rounded-full bg-[#cc8b3c]"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-4">
            <p class="mb-4 text-[13.5px] font-semibold text-stone-900">
              Recordatorios
            </p>
            <div class="space-y-2">
              <div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-[13px] text-amber-900">
                📌
                <strong>IVA bimestral:</strong> Presentar antes del 12 de mayo.
                Período feb–abr 2025.
              </div>
              <div class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 text-[13px] text-blue-900">
                ℹ️
                <strong>Cierre Q1:</strong> El período cierra el 30 de abril.
                Verifique todos los estados.
              </div>
              <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-[13px] text-red-900">
                ⚠️
                <strong>Auditoría activa:</strong> No modifique asientos de
                marzo sin autorización del revisor.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}