import { ModalFormComponent } from "../../Core/components/ModalFormComponent";
import { FormFieldComponent } from "../../Core/components/FormFieldComponent";
import { InputComponent } from "../../Core/components/InputComponent";
import { TextareaComponent } from "../../Core/components/TextareaComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  editing: any;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
}

export default function PositionFormComponent({
  open,
  onClose,
  onSubmit,
  loading,
  editing,
  name,
  setName,
  description,
  setDescription,
}: Props) {
  return (
    <ModalFormComponent
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={editing ? "Editar cargo" : "Nuevo cargo"}
      submitLabel={editing ? "Actualizar" : "Crear"}
      loading={loading}
    >
      <FormFieldComponent label="Nombre" required>
        <InputComponent
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          placeholder="Ej: Contador"
        />
      </FormFieldComponent>
      <FormFieldComponent label="Descripción">
        <TextareaComponent
          value={description}
          onInput={(e) =>
            setDescription((e.target as HTMLTextAreaElement).value)
          }
          rows={2}
          placeholder="Responsabilidades del cargo..."
        />
      </FormFieldComponent>
    </ModalFormComponent>
  );
}
