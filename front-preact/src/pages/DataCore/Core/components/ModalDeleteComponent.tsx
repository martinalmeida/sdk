import { useState } from "preact/hooks";
import { ModalComponent } from "./ModalComponent";
import { AlertTriangle } from "lucide-preact";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  confirmWord?: string;
}

export function ModalDeleteComponent({
  open,
  onClose,
  onConfirm,
  title = "Eliminar registro",
  description,
  loading,
  confirmWord = "ELIMINAR",
}: Props) {
  const [input, setInput] = useState("");
  const isValid = input === confirmWord;

  const handleClose = () => {
    setInput("");
    onClose();
  };

  const handleConfirm = () => {
    if (!isValid) return;
    setInput("");
    onConfirm();
  };

  return (
    <ModalComponent
      open={open}
      onClose={handleClose}
      title={title}
      titleClass="text-red-600"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={handleClose}
            class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || loading}
            class="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Eliminando…" : "Eliminar definitivamente"}
          </button>
        </>
      }
    >
      <div class="space-y-3">
        <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle size={15} class="mt-0.5 shrink-0 text-red-600" />
          <p class="text-[13px] text-red-900">
            {description ?? (
              <>
                Esta acción es <strong>permanente</strong> e irreversible.
              </>
            )}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-[12.5px] font-medium text-stone-600">
            Escriba <span class="font-mono font-semibold">{confirmWord}</span>{" "}
            para confirmar
          </label>
          <input
            type="text"
            placeholder={confirmWord}
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            class={`w-full rounded-lg border px-3 py-2 text-[13px] font-mono outline-none transition-colors
                            ${
                              isValid
                                ? "border-green-400 focus:border-green-500"
                                : "border-stone-200 focus:border-[#cc8b3c]"
                            }`}
          />
        </div>
      </div>
    </ModalComponent>
  );
}
