import { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { X } from "lucide-preact";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  titleClass?: string;
  maxWidth?: string;
  children: ComponentChildren;
  footer?: ComponentChildren;
}

export function ModalComponent({
  open,
  onClose,
  title,
  titleClass = "text-stone-900",
  maxWidth = "max-w-2xl",
  children,
  footer,
}: Props) {
  // Bloquea scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cierra con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        class={`max-h-[calc(100dvh-24px)] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-2xl`}
      >
        {/* Header */}
        <div class="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <p class={`text-[13.5px] font-semibold ${titleClass}`}>{title}</p>
          <button
            onClick={onClose}
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div class="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div class="flex justify-end gap-2 border-t border-stone-200 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
