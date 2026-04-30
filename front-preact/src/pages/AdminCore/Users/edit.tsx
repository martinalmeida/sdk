import { useState } from "preact/hooks";
import { ModalFormComponent } from "../Core/components/ModalFormComponent";
import { ModalConfirmComponent } from "../Core/components/ModalConfirmComponent";
import { ModalDeleteComponent } from "../Core/components/ModalDeleteComponent";
import { FormFieldComponent } from "../Core/components/FormFieldComponent";
import { InputComponent } from "../Core/components/InputComponent";
import { SelectComponent } from "../Core/components/SelectComponent";

interface Props {
  params?: Record<string, string>;
}

export default function EditUser({ params }: Props) {
  const id = params?.id;

  const [modalAsiento, setModalAsiento] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  return (
    <div class="space-y-4">
      {/* Botones para abrir modales — solo demo */}
      <div class="flex gap-2">
        <button
          onClick={() => setModalAsiento(true)}
          class="rounded-lg bg-[#cc8b3c] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#b87830]"
        >
          Nuevo asiento
        </button>
        <button
          onClick={() => setModalConfirm(true)}
          class="rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-medium text-stone-700 hover:bg-stone-50"
        >
          Confirmar
        </button>
        <button
          onClick={() => setModalDelete(true)}
          class="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>

      <h1>{id}</h1>

      {/* Modal Asiento */}
      <ModalFormComponent
        open={modalAsiento}
        onClose={() => setModalAsiento(false)}
        onSubmit={() => console.log("guardar asiento")}
        title="Nuevo Asiento Contable"
        submitLabel="Guardar asiento"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormFieldComponent label="Fecha" required>
            <InputComponent type="date" name="fecha" />
          </FormFieldComponent>
          <FormFieldComponent label="Referencia">
            <InputComponent name="referencia" placeholder="FAC-0000" />
          </FormFieldComponent>
        </div>

        <FormFieldComponent label="Descripción" required>
          <InputComponent
            name="descripcion"
            placeholder="Concepto del asiento…"
          />
        </FormFieldComponent>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormFieldComponent label="Cuenta débito">
            <SelectComponent name="cuentaDebito">
              <option value="1105">1105 — Caja</option>
              <option value="1110">1110 — Bancos</option>
            </SelectComponent>
          </FormFieldComponent>
          <FormFieldComponent label="Débito $">
            <InputComponent
              type="number"
              prefix="$"
              step="0.01"
              placeholder="0.00"
            />
          </FormFieldComponent>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormFieldComponent label="Cuenta crédito">
            <SelectComponent name="cuentaCredito">
              <option value="4135">4135 — Ingresos</option>
              <option value="2105">2105 — Proveedores</option>
            </SelectComponent>
          </FormFieldComponent>
          <FormFieldComponent label="Crédito $">
            <InputComponent
              type="number"
              prefix="$"
              step="0.01"
              placeholder="0.00"
            />
          </FormFieldComponent>
        </div>

        <div class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-[12px] text-blue-900">
          El total de débitos debe ser igual al total de créditos.
        </div>
      </ModalFormComponent>

      {/* Modal Confirmación */}
      <ModalConfirmComponent
        open={modalConfirm}
        onClose={() => setModalConfirm(false)}
        onConfirm={() => {
          console.log("aprobado");
          setModalConfirm(false);
        }}
        title="Confirmar aprobación"
        confirmLabel="Sí, aprobar"
        message={
          <>
            ¿Aprobar el asiento{" "}
            <span class="font-mono font-semibold">AS-2025-0141</span>? No se
            puede deshacer sin autorización del revisor fiscal.
          </>
        }
      />

      {/* Modal Eliminación */}
      <ModalDeleteComponent
        open={modalDelete}
        onClose={() => setModalDelete(false)}
        onConfirm={() => {
          console.log("eliminado");
          setModalDelete(false);
        }}
      />
    </div>
  );
}
