type StatItem = {
  label: string;
  value: string;
  valueTone: string;
  badge: string;
  badgeClass: string;
  note?: string;
};

type Props = {
  items: StatItem[];
};

export default function StatsComponent({ items }: Props) {
  return (
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          class="rounded-xl border border-stone-200 bg-white p-4"
        >
          <p class="text-[12px] text-stone-400">{item.label}</p>

          <p class={`mono mt-1 text-[22px] font-medium ${item.valueTone}`}>
            {item.value}
          </p>

          <div class="mt-2 flex items-center gap-2 text-[11.5px] text-stone-400">
            <span class={`rounded-full px-2 py-0.5 ${item.badgeClass}`}>
              {item.badge}
            </span>
            {item.note ? <span>{item.note}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
