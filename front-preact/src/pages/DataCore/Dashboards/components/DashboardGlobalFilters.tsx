import { useState } from "preact/hooks";

interface Filter {
  id: number;
  name: string;
  label: string;
  input_type: string;
  sql_placeholder: string;
}

interface DashboardGlobalFiltersProps {
  filters: Filter[];
  onFilterChange: (values: Record<string, string | undefined>) => void;
}

export function DashboardGlobalFilters({
  filters,
  onFilterChange,
}: DashboardGlobalFiltersProps) {
  const [values, setValues] = useState<Record<string, string | undefined>>({});

  const handleChange = (name: string, value: string | undefined) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onFilterChange(newValues);
  };

  return (
    <div class="flex flex-wrap gap-4 p-4 bg-stone-50 rounded-lg mb-4">
      {filters.map((f: Filter) => (
        <div key={f.id}>
          <label class="block text-xs font-semibold uppercase">{f.label}</label>
          {f.input_type === "date_range" && (
            <div class="flex gap-2">
              <input
                type="date"
                class="border rounded px-2 py-1"
                onChange={(e) =>
                  handleChange(
                    `${f.sql_placeholder}_from`,
                    (e.target as HTMLInputElement).value,
                  )
                }
              />
              <input
                type="date"
                class="border rounded px-2 py-1"
                onChange={(e) =>
                  handleChange(
                    `${f.sql_placeholder}_to`,
                    (e.target as HTMLInputElement).value,
                  )
                }
              />
            </div>
          )}
          {f.input_type === "text" && (
            <input
              type="text"
              class="border rounded px-2 py-1 w-full"
              onChange={(e) =>
                handleChange(
                  f.sql_placeholder,
                  (e.target as HTMLInputElement).value,
                )
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
