import { signal } from "@preact/signals";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

export const toasts = signal<Toast[]>([]);

let counter = 0;

export function pushToast(
  message: string,
  variant: ToastVariant = "error",
  duration = 4000,
) {
  const id = ++counter;
  toasts.value = [...toasts.value, { id, message, variant }];
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, duration);
}

export function dismissToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}
