import { ModalFormComponent } from "../../Core/components/ModalFormComponent";
import { FormFieldComponent } from "../../Core/components/FormFieldComponent";
import { InputComponent } from "../../Core/components/InputComponent";
import { TextareaComponent } from "../../Core/components/TextareaComponent";
import { CheckboxComponent } from "../../Core/components/CheckboxComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  editing: any;
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  version: string;
  setVersion: (v: string) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
}

export default function ProgramFormComponent({
  open,
  onClose,
  onSubmit,
  loading,
  editing,
  name,
  setName,
  slug,
  setSlug,
  description,
  setDescription,
  version,
  setVersion,
  isActive,
  setIsActive,
}: Props) {
  return (
    <ModalFormComponent
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={editing ? "Editar programa" : "Nuevo programa"}
      submitLabel={editing ? "Actualizar" : "Crear"}
      loading={loading}
      maxWidth="max-w-xl"
    >
      <FormFieldComponent label="Nombre" required>
        <InputComponent
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          placeholder="Ej: DataCore"
        />
      </FormFieldComponent>
      <FormFieldComponent label="Slug (identificador único)" required>
        <InputComponent
          value={slug}
          onInput={(e) => setSlug((e.target as HTMLInputElement).value)}
          placeholder="Ej: data-core"
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
      <div class="grid grid-cols-2 gap-3">
        <FormFieldComponent label="Versión">
          <InputComponent
            value={version}
            onInput={(e) => setVersion((e.target as HTMLInputElement).value)}
            placeholder="0.1"
          />
        </FormFieldComponent>
        <FormFieldComponent label="Activo">
          <CheckboxComponent
            label="Programa disponible"
            checked={isActive}
            onChange={(e) =>
              setIsActive((e.target as HTMLInputElement).checked)
            }
          />
        </FormFieldComponent>
      </div>
    </ModalFormComponent>
  );
}
