import { useEffect } from "preact/hooks";

interface Props {
  message?: string;
  submessage?: string;
}

export default function LoaderComponent({
  message = "Cargando sistema",
  submessage = "Preparando tu espacio de trabajo…",
}: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      style={{ zIndex: 9999 }}
      class="fixed inset-0 flex flex-col items-center justify-center bg-stone-50 overflow-hidden"
    >
      <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes bar { 0%,100%{height:8px} 50%{height:22px} }
                @keyframes progress { 0%{width:0%} 100%{width:85%} }
            `}</style>

      {/* Grid decorativo de fondo */}
      <div
        class="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(#e7e5e0 1px, transparent 1px), linear-gradient(90deg, #e7e5e0 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div class="relative flex flex-col items-center gap-8">
        {/* Logo flotante con anillo giratorio */}
        <div
          style={{
            animation: "float 2.5s ease-in-out infinite",
            position: "relative",
            width: "56px",
            height: "56px",
          }}
        >
          <div class="flex h-[56px] w-[56px] items-center justify-center rounded-[14px] bg-[#cc8b3c]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              stroke-width="2.2"
              stroke-linecap="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <svg
            class="absolute animate-spin"
            style={{
              top: "-10px",
              left: "-10px",
              width: "76px",
              height: "76px",
              animationDuration: "1.4s",
            }}
            viewBox="0 0 76 76"
          >
            <circle
              cx="38"
              cy="38"
              r="34"
              fill="none"
              stroke="#cc8b3c"
              stroke-width="1.5"
              stroke-opacity="0.15"
            />
            <circle
              cx="38"
              cy="38"
              r="34"
              fill="none"
              stroke="#cc8b3c"
              stroke-width="1.5"
              stroke-dasharray="213"
              stroke-dashoffset="160"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-stone-50" />
        </div>

        {/* Ecualizador animado */}
        <div class="flex items-end gap-[3px]" style={{ height: "28px" }}>
          {[
            { opacity: "0.4", anim: "bar 0.9s ease-in-out infinite 0s" },
            { opacity: "0.6", anim: "bar 0.9s ease-in-out infinite 0.1s" },
            { opacity: "1", anim: "bar 0.9s ease-in-out infinite 0.2s" },
            { opacity: "0.7", anim: "bar 0.9s ease-in-out infinite 0.3s" },
            { opacity: "0.5", anim: "bar 0.9s ease-in-out infinite 0.4s" },
          ].map(({ opacity, anim }, i) => (
            <div
              key={i}
              class="w-[5px] rounded-full bg-[#cc8b3c]"
              style={{ opacity, animation: anim, height: "8px" }}
            />
          ))}
        </div>

        {/* Texto */}
        <div class="flex flex-col items-center gap-1">
          <p class="text-[15px] font-bold tracking-tight text-stone-800">
            {message}
          </p>
          <p class="font-mono text-[12.5px] text-stone-400">{submessage}</p>
        </div>

        {/* Barra de progreso */}
        <div class="flex w-[220px] flex-col gap-1.5">
          <div class="h-1 overflow-hidden rounded-full bg-stone-200">
            <div
              class="h-full rounded-full bg-[#cc8b3c]"
              style={{
                animation: "progress 2.5s cubic-bezier(.4,0,.2,1) forwards",
                width: "0%",
              }}
            />
          </div>
          <div class="flex items-center justify-between font-mono text-[11px] text-stone-400">
            <span>Iniciando módulos</span>
            <span class="text-[#cc8b3c]">●</span>
          </div>
        </div>

        {/* Terminal pill */}
        <div class="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 font-mono text-[11.5px] text-stone-400">
          <span class="text-[#cc8b3c]">$</span>
          <span class="text-stone-500">boot</span>
          <span>--env=production</span>
          <span class="inline-block h-[13px] w-[7px] animate-pulse rounded-sm bg-[#cc8b3c]" />
        </div>
      </div>

      {/* Version tag */}
      <div class="absolute bottom-4 right-5 font-mono text-[11px] text-stone-300">
        DataCore v0.1
      </div>
    </div>
  );
}
