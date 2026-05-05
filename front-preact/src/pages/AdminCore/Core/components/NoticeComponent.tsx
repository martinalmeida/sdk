import { ComponentChildren } from "preact";

type NoticeVariant = "warning" | "info" | "danger" | "success";

type Props = {
  variant: NoticeVariant;
  title: string;
  description: string;
  icon?: string;
  children?: ComponentChildren;
};

const styles: Record<
  NoticeVariant,
  { border: string; bg: string; text: string }
> = {
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-900",
  },
  info: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-900",
  },
  danger: {
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-900",
  },
  success: {
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-900",
  },
};

export default function NoticeComponent({
  variant,
  title,
  description,
  icon,
  children,
}: Props) {
  const style = styles[variant];
  return (
    <div
      role="status"
      aria-live="polite"
      class={`rounded-xl border px-4 py-3 text-sm ${style.border} ${style.bg} ${style.text}`}
    >
      {icon ? <span class="mr-1">{icon}</span> : null}
      <strong>{title}</strong> {description}
      {children}
    </div>
  );
}
