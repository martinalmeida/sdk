interface Props {
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function FormActionsComponent({
  onCancel,
  submitLabel = "Guardar",
  loading,
}: Props) {
  return (
    <div class="flex justify-end gap-2 pt-1">
      <button
        type="button"
        onClick={onCancel}
        class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={loading}
        class="rounded-lg bg-[#cc8b3c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#b87830] transition-colors disabled:opacity-60"
      >
        {loading ? "Guardando…" : submitLabel}
      </button>
    </div>
  );
}