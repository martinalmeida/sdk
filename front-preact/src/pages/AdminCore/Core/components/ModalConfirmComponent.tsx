import { ComponentChildren } from "preact";
import { ModalComponent } from "./ModalComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: ComponentChildren;
  confirmLabel?: string;
  loading?: boolean;
}

export function ModalConfirmComponent({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmLabel = "Confirmar",
  loading,
}: Props) {
  return (
    <ModalComponent
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            class="rounded-lg bg-[#7c3aed] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#6d28d9] transition-colors disabled:opacity-60"
          >
            {loading ? "Procesando…" : confirmLabel}
          </button>
        </>
      }
    >
      <p class="text-[13.5px] text-stone-600">{message}</p>
    </ModalComponent>
  );
}
