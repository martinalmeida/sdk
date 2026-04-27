interface Props {
  name?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  onInput?: (e: Event) => void;
}

export function TextareaComponent({
  name,
  value,
  placeholder,
  rows = 3,
  onInput,
}: Props) {
  return (
    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      rows={rows}
      onInput={onInput}
      class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#cc8b3c]"
    />
  );
}