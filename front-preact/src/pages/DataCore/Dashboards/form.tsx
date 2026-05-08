import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ChevronLeft } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";
import { FormFieldComponent } from "../Core/components/FormFieldComponent";
import { InputComponent } from "../Core/components/InputComponent";
import { TextareaComponent } from "../Core/components/TextareaComponent";
import { SelectComponent } from "../Core/components/SelectComponent";
import { CheckboxComponent } from "../Core/components/CheckboxComponent";
import { dashboardsApi } from "./services";

interface Props {
  params?: Record<string, string>;
}

export default function DashboardForm({ params }: Props) {
  const id = params?.id;
  const isEditing = !!id;
  const { route } = useLocation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadDashboard();
    }
    setPageTitle(
      isEditing ? "Editar tablero" : "Nuevo tablero",
      "Configuración del tablero",
    );
  }, [isEditing]);

  const loadDashboard = async () => {
    if (!id) return;
    const res = await dashboardsApi.getDashboard(parseInt(id));
    if (res.data) {
      setName(res.data.name ?? "");
      setDescription(res.data.description ?? "");
      setStatus(res.data.status ?? "draft");
      setIsPublic(res.data.is_public ?? false);
    } else {
      alert("Error al cargar el tablero");
      route("/data-core/tableros");
    }
  };

  const handleSubmit = async () => {
    if (!name) return;
    setLoading(true);
    const payload = {
      name,
      description: description || null,
      status,
      is_public: isPublic,
    };
    let res;
    if (isEditing && params?.id) {
      res = await dashboardsApi.updateDashboard(parseInt(params.id), payload);
    } else {
      res = await dashboardsApi.createDashboard(payload);
    }
    if (!res.error) {
      route("/data-core/tableros");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div class="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => route("/data-core/tableros")}
        class="mb-4 inline-flex items-center gap-1 text-sm text-stone-500"
      >
        <ChevronLeft size={14} /> Volver a tableros
      </button>

      <div class="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
        <h2 class="text-xl font-bold">
          {isEditing ? "Editar tablero" : "Nuevo tablero"}
        </h2>

        <FormFieldComponent label="Nombre" required>
          <InputComponent
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
          />
        </FormFieldComponent>

        <FormFieldComponent label="Descripción">
          <TextareaComponent
            value={description}
            onInput={(e) =>
              setDescription((e.target as HTMLTextAreaElement).value)
            }
            rows={2}
          />
        </FormFieldComponent>

        <FormFieldComponent label="Estado">
          <SelectComponent
            value={status}
            onChange={(e) => setStatus((e.target as HTMLSelectElement).value)}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </SelectComponent>
        </FormFieldComponent>

        <FormFieldComponent label="Visibilidad">
          <CheckboxComponent
            label="Público (accesible para todos)"
            checked={isPublic}
            onChange={(e) =>
              setIsPublic((e.target as HTMLInputElement).checked)
            }
          />
        </FormFieldComponent>

        <div class="flex justify-end gap-3 pt-4">
          <button
            onClick={() => route("/data-core/tableros")}
            class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            class="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
