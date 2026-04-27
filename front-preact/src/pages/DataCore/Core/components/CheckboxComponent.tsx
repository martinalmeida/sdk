interface Props {
  label: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: Event) => void;
}

export function CheckboxComponent({ label, name, checked, onChange }: Props) {
  return (
    <label class="flex items-center gap-2 text-[13px] text-stone-600 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        class="accent-[#cc8b3c]"
      />
      {label}
    </label>
  );
}