import { useEffect, useState } from "preact/hooks";
import { ChevronDown, ChevronRight } from "lucide-preact";
import LoaderComponent from "../Core/components/LoaderComponent";
import NoticeComponent from "../Core/components/NoticeComponent";
import { setPageTitle } from "../Core/hooks";
import { useChartTypes } from "./hooks";

export default function ChartTypesPage() {
  const { chartTypes, loading } = useChartTypes();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setPageTitle("Tipos de gráfico", "Catálogo de tipos soportados");
  }, []);

  const toggle = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading)
    return <LoaderComponent message="Cargando tipos de gráfico..." />;

  return (
    <div class="p-6">
      <NoticeComponent
        variant="info"
        title="ℹ️ Tipos de gráfico"
        description="Cada tipo define reglas estructurales y filtros que deben cumplir las consultas SQL para ser válidas."
      />
      <div class="mt-6 space-y-4">
        {chartTypes.map((type) => (
          <div
            key={type.id}
            class="rounded-xl border border-stone-200 bg-white overflow-hidden"
          >
            <button
              onClick={() => toggle(type.id)}
              class="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">{type.icon || "📊"}</span>
              </div>
              <div class="flex-1 ml-3">
                <h3 class="font-semibold text-stone-900">{type.label}</h3>
                <p class="text-xs text-stone-500">
                  {type.description || "Sin descripción"}
                </p>
              </div>
              {expanded[type.id] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {expanded[type.id] && (
              <div class="border-t border-stone-100 p-4 bg-stone-50">
                <div class="mb-3">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Reglas
                  </h4>
                  <ul class="list-disc list-inside text-sm text-stone-600">
                    <li>
                      Soporta múltiples series:{" "}
                      {type.supports_multiple_series ? "Sí" : "No"}
                    </li>
                    <li>
                      Requiere eje de categorías:{" "}
                      {type.requires_category_axis ? "Sí" : "No"}
                    </li>
                    <li>
                      Requiere eje de valores:{" "}
                      {type.requires_value_axis ? "Sí" : "No"}
                    </li>
                    {type.rules?.map((rule) => (
                      <li key={rule.id}>
                        {rule.description ||
                          `${rule.rule_key}: ${rule.rule_value}`}
                      </li>
                    ))}
                  </ul>
                </div>
                {type.filters && type.filters.length > 0 && (
                  <div>
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                      Filtros soportados
                    </h4>
                    <ul class="list-disc list-inside text-sm text-stone-600">
                      {type.filters.map((filter) => (
                        <li key={filter.id}>
                          {filter.label} ({filter.input_type}) – placeholder:{" "}
                          {filter.sql_placeholder}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
