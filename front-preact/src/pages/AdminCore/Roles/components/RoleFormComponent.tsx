import { ModalFormComponent } from "../../Core/components/ModalFormComponent";
import { FormFieldComponent } from "../../Core/components/FormFieldComponent";
import { InputComponent } from "../../Core/components/InputComponent";
import { TextareaComponent } from "../../Core/components/TextareaComponent";
import { CheckboxComponent } from "../../Core/components/CheckboxComponent";
import { SelectComponent } from "../../Core/components/SelectComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  editingRole: any;
  name: string;
  setName: (v: string) => void;
  label: string;
  setLabel: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  isGlobal: boolean;
  setIsGlobal: (v: boolean) => void;
  programId: string;
  setProgramId: (v: string) => void;
  programs: any[];
}

export default function RoleFormComponent({
  open,
  onClose,
  onSubmit,
  loading,
  editingRole,
  name,
  setName,
  label,
  setLabel,
  description,
  setDescription,
  isGlobal,
  setIsGlobal,
  programId,
  setProgramId,
  programs,
}: Props) {
  return (
    <ModalFormComponent
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={editingRole ? "Editar rol" : "Nuevo rol"}
      submitLabel={editingRole ? "Actualizar" : "Crear"}
      loading={loading}
      maxWidth="max-w-xl"
    >
      <FormFieldComponent label="Nombre (identificador único)" required>
        <InputComponent
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
        />
      </FormFieldComponent>
      <FormFieldComponent label="Etiqueta (nombre visible)" required>
        <InputComponent
          value={label}
          onInput={(e) => setLabel((e.target as HTMLInputElement).value)}
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
      <FormFieldComponent>
        <CheckboxComponent
          label="Rol global (aplica a todos los programas)"
          checked={isGlobal}
          onChange={(e) => setIsGlobal((e.target as HTMLInputElement).checked)}
        />
      </FormFieldComponent>
      {!isGlobal && (
        <FormFieldComponent label="Programa asociado" required>
          <SelectComponent
            value={programId}
            onChange={(e) =>
              setProgramId((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">Seleccionar programa</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectComponent>
        </FormFieldComponent>
      )}
    </ModalFormComponent>
  );
}
