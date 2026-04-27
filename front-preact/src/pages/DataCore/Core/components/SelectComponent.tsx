import { ComponentChildren } from "preact";

interface Props {
  name?: string;
  value?: string;
  children: ComponentChildren;
  onChange?: (e: Event) => void;
}

export function SelectComponent({ name, value, children, onChange }: Props) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#cc8b3c]"
    >
      {children}
    </select>
  );
}