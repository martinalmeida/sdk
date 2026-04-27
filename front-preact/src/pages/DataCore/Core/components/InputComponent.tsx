interface Props {
  type?: string;
  value?: string | number;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  prefix?: string;
  hasError?: boolean;
  step?: string;
  name?: string;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}

export function InputComponent({
  type = "text",
  value,
  placeholder,
  readonly,
  disabled,
  prefix,
  hasError,
  step,
  name,
  onInput,
  onChange,
}: Props) {
  const base = `w-full rounded-lg border px-3 py-2 text-[13px] outline-none transition-colors
        ${
          hasError
            ? "border-red-300 focus:border-red-500"
            : "border-stone-200 focus:border-[#cc8b3c]"
        }
        ${readonly || disabled ? "bg-stone-50 text-stone-400" : "bg-white"}`;

  if (prefix) {
    return (
      <div class="flex">
        <span class="rounded-l-lg border border-r-0 border-stone-200 bg-stone-100 px-3 py-2 text-[13px] text-stone-500 font-mono">
          {prefix}
        </span>
        <input
          class={`${base} rounded-l-none`}
          type={type}
          value={value}
          placeholder={placeholder}
          readOnly={readonly}
          disabled={disabled}
          step={step}
          name={name}
          onInput={onInput}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <input
      class={base}
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readonly}
      disabled={disabled}
      step={step}
      name={name}
      onInput={onInput}
      onChange={onChange}
    />
  );
}