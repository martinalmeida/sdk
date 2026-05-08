import { toasts, dismissToast, type ToastVariant } from "./";
import { X } from "lucide-preact";

const styles: Record<ToastVariant, string> = {
  error: "bg-red-50 border-red-200 text-red-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const icons: Record<ToastVariant, string> = {
  error: "⚠️",
  success: "✅",
  warning: "📌",
  info: "ℹ️",
};

export default function ToastContainer() {
  if (toasts.value.length === 0) return null;

  return (
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.value.map((toast) => (
        <div
          key={toast.id}
          class={`flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px] shadow-lg ${styles[toast.variant]}`}
        >
          <span>{icons[toast.variant]}</span>
          <span class="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            class="mt-0.5 opacity-50 hover:opacity-100"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
