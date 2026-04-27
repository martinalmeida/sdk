import { ComponentChildren } from "preact";

interface Props {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ComponentChildren;
}

export function FormFieldComponent({ label, required, hint, error, children }: Props) {
  return (
    <div>
      <label class="mb-1 block text-[12.5px] font-medium text-stone-600">
        {label} {required && <span class="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p class="mt-1 text-[11.5px] text-stone-400">{hint}</p>
      )}
      {error && <p class="mt-1 text-[11.5px] text-red-600">{error}</p>}
    </div>
  );
}