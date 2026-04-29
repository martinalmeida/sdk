export function index() {
  return (
    <>
      <div class="split-grid">
        <div class="panel panel-left">
          <div class="panel-content">
            <div class="mb-6 flex justify-center">
              <div class="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl ring-1 ring-amber-200/50">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cc8b3c"
                  stroke-width="1.8"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                </svg>
              </div>
            </div>
            <h2>DataCore</h2>
            <div class="mt-3">
              <span class="badge bg-amber-100/80 text-amber-800">
                Estadisticas · v0.1
              </span>
            </div>
            <p class="mt-4 text-sm sm:text-base text-stone-600">
              Sistema de big data analitico para empresas multidepartamentales
            </p>
            <div class="mt-6 sm:mt-8">
              <a href="/data-core" class="btn-primary">Ingresar →</a>
            </div>
            <p class="mt-4 text-xs uppercase tracking-widest text-stone-400">
              Click para acceder
            </p>
          </div>
        </div>

        <div class="panel panel-right">
          <div class="panel-content">
            <div class="mb-6 flex justify-center">
              <div class="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl ring-1 ring-blue-200/50">
                <svg
                  width="40"
                  height="40"
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
              </div>
            </div>
            <h2>HelpCore</h2>
            <div class="mt-3">
              <span class="badge bg-blue-100/80 text-blue-800">
                Soporte · v0.1
              </span>
            </div>
            <p class="mt-4 text-sm sm:text-base text-stone-600">
			  Sistema de soporte para empresas multidepartamentales
            </p>
            <div class="mt-6 sm:mt-8">
              <span class="btn-secondary">Acceder →</span>
            </div>
            <p class="mt-4 text-xs uppercase tracking-widest text-stone-400">
              Click para acceder
            </p>
          </div>
        </div>
      </div>

      <div class="status-bar">
        <span style="background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 60px; font-size: 11px; font-weight: 500; color: #57534e; box-shadow: 0 8px 16px -6px rgba(0,0,0,0.04); border: 1px solid rgba(231,229,228,0.4); letter-spacing: 0.4px;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px #22c55e;"></span>
          Sistema activo · Elige tu entorno
        </span>
      </div>
    </>
  );
}