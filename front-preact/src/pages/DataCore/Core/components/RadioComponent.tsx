interface Props {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: Event) => void;
}

export function RadioComponent({ label, name, value, checked, onChange }: Props) {
  return (
    <label class="flex items-center gap-2 text-[13px] text-stone-600 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        class="accent-[#cc8b3c]"
      />
      {label}
    </label>
  );
}