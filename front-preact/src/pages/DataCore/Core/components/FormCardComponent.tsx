import { ComponentChildren } from "preact";

interface Props {
  title: string;
  children: ComponentChildren;
}

export function FormCardComponent({ title, children }: Props) {
  return (
    <div class="rounded-xl border border-stone-200 bg-white p-4">
      <p class="mb-4 text-[13.5px] font-semibold text-stone-900">{title}</p>
      <div class="space-y-3">{children}</div>
    </div>
  );
}