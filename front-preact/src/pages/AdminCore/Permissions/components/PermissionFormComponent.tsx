import { ModalFormComponent } from "../../Core/components/ModalFormComponent";
import { FormFieldComponent } from "../../Core/components/FormFieldComponent";
import { InputComponent } from "../../Core/components/InputComponent";
import { SelectComponent } from "../../Core/components/SelectComponent";
import { programs as programsSignal } from "../../Users/stores/programsStore";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  editing: any;
  name: string;
  setName: (v: string) => void;
  label: string;
  setLabel: (v: string) => void;
  group: string;
  setGroup: (v: string) => void;
  programId: string;
  setProgramId: (v: string) => void;
}

export default function PermissionFormComponent({
  open,
  onClose,
  onSubmit,
  loading,
  editing,
  name,
  setName,
  label,
  setLabel,
  group,
  setGroup,
  programId,
  setProgramId,
}: Props) {
  return (
    <ModalFormComponent
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={editing ? "Editar permiso" : "Nuevo permiso"}
      submitLabel={editing ? "Actualizar" : "Crear"}
      loading={loading}
    >
      <FormFieldComponent label="Identificador (name)" required>
        <InputComponent
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          placeholder="ej: admin.users.read"
        />
      </FormFieldComponent>
      <FormFieldComponent label="Etiqueta (label)" required>
        <InputComponent
          value={label}
          onInput={(e) => setLabel((e.target as HTMLInputElement).value)}
          placeholder="ej: Listar usuarios"
        />
      </FormFieldComponent>
      <FormFieldComponent label="Grupo" required>
        <InputComponent
          value={group}
          onInput={(e) => setGroup((e.target as HTMLInputElement).value)}
          placeholder="ej: users"
        />
      </FormFieldComponent>
      <FormFieldComponent label="Programa asociado">
        <SelectComponent
          value={programId}
          onChange={(e) => setProgramId((e.target as HTMLSelectElement).value)}
        >
          <option value="">Global (todos los programas)</option>
          {programsSignal.value.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectComponent>
      </FormFieldComponent>
    </ModalFormComponent>
  );
}
