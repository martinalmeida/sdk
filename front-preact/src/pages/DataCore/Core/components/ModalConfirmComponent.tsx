interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: ComponentChildren;
  confirmLabel?: string;
  loading?: boolean;
}

import { ComponentChildren } from "preact";
import { ModalComponent } from "./ModalComponent";

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
            class="rounded-lg bg-[#cc8b3c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#b87830] transition-colors disabled:opacity-60"
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
