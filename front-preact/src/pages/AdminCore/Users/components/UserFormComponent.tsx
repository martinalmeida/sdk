import { ModalFormComponent } from "../../Core/components/ModalFormComponent";
import { FormFieldComponent } from "../../Core/components/FormFieldComponent";
import { InputComponent } from "../../Core/components/InputComponent";
import { SelectComponent } from "../../Core/components/SelectComponent";
import { programs as programsSignal } from "../stores/programsStore";
import { roles as rolesSignal } from "../stores/rolesStore";
import { positions as positionsSignal } from "../stores/positionsStore";
import { Plus, Trash2 } from "lucide-preact";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  editingUser: any;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (v: string) => void;
  positionId: string;
  setPositionId: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  assignedPrograms: any[];
  addProgram: () => void;
  updateAssignedProgram: (idx: number, field: string, value: any) => void;
  removeProgram: (idx: number) => void;
}

export default function UserFormComponent({
  open,
  onClose,
  onSubmit,
  loading,
  editingUser,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  positionId,
  setPositionId,
  status,
  setStatus,
  assignedPrograms,
  addProgram,
  updateAssignedProgram,
  removeProgram,
}: Props) {
  return (
    <ModalFormComponent
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={editingUser ? "Editar usuario" : "Nuevo usuario"}
      submitLabel={editingUser ? "Actualizar" : "Crear usuario"}
      loading={loading}
      maxWidth="max-w-2xl"
    >
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormFieldComponent label="Nombre" required>
          <InputComponent
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
          />
        </FormFieldComponent>
        <FormFieldComponent label="Email" required>
          <InputComponent
            type="email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
        </FormFieldComponent>
      </div>

      {!editingUser && (
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormFieldComponent label="Contraseña" required>
            <InputComponent
              type="password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
          </FormFieldComponent>
          <FormFieldComponent label="Confirmar contraseña" required>
            <InputComponent
              type="password"
              value={passwordConfirmation}
              onInput={(e) =>
                setPasswordConfirmation((e.target as HTMLInputElement).value)
              }
            />
          </FormFieldComponent>
        </div>
      )}

      {editingUser && (
        <FormFieldComponent label="Contraseña (dejar en blanco para no cambiar)">
          <InputComponent
            type="password"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
        </FormFieldComponent>
      )}

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormFieldComponent label="Cargo">
          <SelectComponent
            value={positionId}
            onChange={(e) =>
              setPositionId((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">Seleccionar</option>
            {positionsSignal.value.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name}
              </option>
            ))}
          </SelectComponent>
        </FormFieldComponent>
        <FormFieldComponent label="Estado">
          <SelectComponent
            value={status}
            onChange={(e) => setStatus((e.target as HTMLSelectElement).value)}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="suspended">Suspendido</option>
          </SelectComponent>
        </FormFieldComponent>
      </div>

      <div class="border-t border-stone-200 pt-3 mt-2">
        <div class="flex justify-between items-center mb-2">
          <label class="text-[12px] font-semibold text-stone-700">
            Programas asignados
          </label>
          <button
            type="button"
            onClick={addProgram}
            class="inline-flex items-center gap-1 text-xs text-[#7c3aed] hover:underline"
          >
            <Plus size={12} /> Agregar programa
          </button>
        </div>
        {assignedPrograms.length === 0 ? (
          <p class="text-[12px] text-stone-400">
            No hay programas asignados. Agrega uno.
          </p>
        ) : (
          <div class="space-y-2">
            {assignedPrograms.map((prog, idx) => (
              <div
                key={idx}
                class="flex items-center gap-2 bg-stone-50 p-2 rounded-lg"
              >
                <SelectComponent
                  value={prog.program_id}
                  onChange={(e) =>
                    updateAssignedProgram(
                      idx,
                      "program_id",
                      parseInt((e.target as HTMLSelectElement).value),
                    )
                  }
                >
                  {programsSignal.value.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </SelectComponent>
                <SelectComponent
                  value={prog.role_id}
                  onChange={(e) =>
                    updateAssignedProgram(
                      idx,
                      "role_id",
                      parseInt((e.target as HTMLSelectElement).value),
                    )
                  }
                >
                  {rolesSignal.value
                    .filter(
                      (r) => r.program_id === prog.program_id || r.is_global,
                    )
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                </SelectComponent>
                <button
                  type="button"
                  onClick={() => removeProgram(idx)}
                  class="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalFormComponent>
  );
}
