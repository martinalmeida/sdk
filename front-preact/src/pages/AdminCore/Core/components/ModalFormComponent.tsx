import { ComponentChildren } from "preact";
import { ModalComponent } from "./ModalComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitLabel?: string;
  loading?: boolean;
  maxWidth?: string;
  children: ComponentChildren;
}

export function ModalFormComponent({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel = "Guardar",
  loading,
  maxWidth = "max-w-2xl",
  children,
}: Props) {
  return (
    <ModalComponent
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            class="rounded-lg bg-[#7c3aed] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#6d28d9] transition-colors disabled:opacity-60"
          >
            {loading ? "Guardando…" : submitLabel}
          </button>
        </>
      }
    >
      <div class="space-y-3">{children}</div>
    </ModalComponent>
  );
}
