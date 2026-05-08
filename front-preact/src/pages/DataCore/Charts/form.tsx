import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft, CheckCircle, XCircle, Loader } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";
import { FormFieldComponent } from "../Core/components/FormFieldComponent";
import { InputComponent } from "../Core/components/InputComponent";
import { SelectComponent } from "../Core/components/SelectComponent";
import { TextareaComponent } from "../Core/components/TextareaComponent";
import { CheckboxComponent } from "../Core/components/CheckboxComponent";
import { useChartForm } from "./hooks";

interface Props {
  params?: Record<string, string>;
}

export default function ChartForm({ params }: Props) {
  const { route } = useLocation();
  const id = params?.id;
  const isEditing = !!id;
  const onSuccess = () => route("/data-core/graficas");
  const form = useChartForm(onSuccess);

  //Cargar gráfica si estamos en modo edición y aún no se ha cargado
  useEffect(() => {
    if (id && !form.editingChart && !form.loading) {
      form.loadChart(parseInt(id));
    }
  }, [id, form.editingChart, form.loading]);

  useEffect(() => {
    setPageTitle(
      isEditing ? "Editar gráfica" : "Nueva gráfica",
      "Define la consulta SQL y configura el gráfico",
    );
  }, [isEditing]);

  return (
    <div class="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => route("/data-core/graficas")}
        class="mb-4 inline-flex items-center gap-1 text-sm text-stone-500"
      >
        <ChevronLeft size={14} /> Volver a gráficas
      </button>

      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormFieldComponent label="Nombre" required>
            <InputComponent
              value={form.name}
              onInput={(e) =>
                form.setName((e.target as HTMLInputElement).value)
              }
            />
          </FormFieldComponent>
          <FormFieldComponent label="Tipo de gráfico" required>
            <SelectComponent
              value={form.chartTypeId}
              onChange={(e) =>
                form.setChartTypeId((e.target as HTMLSelectElement).value)
              }
            >
              <option value="">Seleccionar</option>
              {form.chartTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </SelectComponent>
          </FormFieldComponent>
        </div>

        <FormFieldComponent label="Descripción">
          <TextareaComponent
            value={form.description}
            onInput={(e) =>
              form.setDescription((e.target as HTMLTextAreaElement).value)
            }
            rows={2}
          />
        </FormFieldComponent>

        <FormFieldComponent label="Consulta SQL" required>
          <div class="relative">
            <TextareaComponent
              value={form.sqlQuery}
              onInput={(e) => {
                form.setSqlQuery((e.target as HTMLTextAreaElement).value);
                form.setSqlValid(null);
                form.setSqlError("");
              }}
              rows={8}
              placeholder="SELECT categoria, SUM(monto) as total FROM ventas GROUP BY categoria"
            />
            <div class="mt-2 flex justify-end">
              <button
                type="button"
                onClick={form.validateSql}
                disabled={
                  !form.sqlQuery || !form.chartTypeId || form.validating
                }
                class="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-xs font-medium hover:bg-stone-200 disabled:opacity-50"
              >
                {form.validating && <Loader size={14} class="animate-spin" />}
                Validar SQL
              </button>
            </div>
            {form.sqlValid !== null && (
              <div
                class={`mt-2 text-xs ${form.sqlValid ? "text-green-600" : "text-red-600"}`}
              >
                {form.sqlValid ? (
                  <span class="inline-flex items-center gap-1">
                    <CheckCircle size={12} /> SQL válida
                  </span>
                ) : (
                  <span class="inline-flex items-center gap-1">
                    <XCircle size={12} /> {form.sqlError || "SQL inválida"}
                  </span>
                )}
              </div>
            )}
          </div>
        </FormFieldComponent>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormFieldComponent label="Columna para eje X (categoría)">
            <InputComponent
              value={form.xAxisColumn}
              onInput={(e) =>
                form.setXAxisColumn((e.target as HTMLInputElement).value)
              }
              placeholder="nombre_columna"
            />
          </FormFieldComponent>
          <FormFieldComponent label="Columna para eje Y (valor)">
            <InputComponent
              value={form.yAxisColumn}
              onInput={(e) =>
                form.setYAxisColumn((e.target as HTMLInputElement).value)
              }
              placeholder="total"
            />
          </FormFieldComponent>
          <FormFieldComponent label="Columna para series (agrupación)">
            <InputComponent
              value={form.seriesColumn}
              onInput={(e) =>
                form.setSeriesColumn((e.target as HTMLInputElement).value)
              }
              placeholder="anio"
            />
          </FormFieldComponent>
          <FormFieldComponent label="Columna para etiquetas">
            <InputComponent
              value={form.labelColumn}
              onInput={(e) =>
                form.setLabelColumn((e.target as HTMLInputElement).value)
              }
              placeholder="nombre"
            />
          </FormFieldComponent>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormFieldComponent label="Estado">
            <SelectComponent
              value={form.status}
              onChange={(e) =>
                form.setStatus((e.target as HTMLSelectElement).value)
              }
            >
              <option value="draft">Borrador</option>
              <option value="validated">Validada</option>
              <option value="published">Publicada</option>
              <option value="deprecated">Deprecada</option>
            </SelectComponent>
          </FormFieldComponent>
          <FormFieldComponent label="Visibilidad">
            <CheckboxComponent
              label="Pública (accesible para todos)"
              checked={form.isPublic}
              onChange={(e) =>
                form.setIsPublic((e.target as HTMLInputElement).checked)
              }
            />
          </FormFieldComponent>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            onClick={() => route("/data-core/graficas")}
            class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700"
          >
            Cancelar
          </button>
          <button
            onClick={form.handleSubmit}
            class="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white"
          >
            {isEditing ? "Actualizar" : "Crear"} gráfica
          </button>
        </div>
      </div>
    </div>
  );
}
