import { useLocation } from "preact-iso";
import { FormCardComponent } from "../Core/components/FormCardComponent";
import { FormFieldComponent } from "../Core/components/FormFieldComponent";
import { FormActionsComponent } from "../Core/components/FormActionsComponent";
import { InputComponent } from "../Core/components/InputComponent";
import { SelectComponent } from "../Core/components/SelectComponent";
import { TextareaComponent } from "../Core/components/TextareaComponent";
import { CheckboxComponent } from "../Core/components/CheckboxComponent";
import { RadioComponent } from "../Core/components/RadioComponent";
import { useEditUser } from "./hooks";

interface Props {
  params?: Record<string, string>;
}

export default function EditUser({ params }: Props) {
  const id = params?.id;
  const { route } = useLocation();
  const {
    asiento,
    updateAsiento,
    submitAsiento,
    loadingAsiento,
    tercero,
    updateTercero,
    submitTercero,
    loadingTercero,
    debitoCreditorError,
  } = useEditUser();

  return (
    <div class="space-y-4">
      {/* Breadcrumb */}
      <div class="border-b border-stone-200 pb-3">
        <p class="text-[11.5px] font-semibold uppercase tracking-[.07em] text-stone-400">
          Usuarios · Editar #{id}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* ── Formulario Asiento ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitAsiento();
          }}
        >
          <FormCardComponent title="Nuevo Asiento Contable">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormFieldComponent label="Fecha" required>
                <InputComponent
                  type="date"
                  name="fecha"
                  value={asiento.fecha}
                  onInput={(e) =>
                    updateAsiento("fecha", (e.target as HTMLInputElement).value)
                  }
                />
              </FormFieldComponent>
              <FormFieldComponent
                label="N.° Asiento"
                hint="Generado automáticamente"
              >
                <InputComponent value="AS-2025-0142" readonly />
              </FormFieldComponent>
            </div>

            <FormFieldComponent label="Descripción" required>
              <InputComponent
                name="descripcion"
                placeholder="Concepto del movimiento…"
                value={asiento.descripcion}
                onInput={(e) =>
                  updateAsiento(
                    "descripcion",
                    (e.target as HTMLInputElement).value,
                  )
                }
              />
            </FormFieldComponent>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormFieldComponent label="Cuenta débito" required>
                <SelectComponent
                  name="cuentaDebito"
                  value={asiento.cuentaDebito}
                  onChange={(e) =>
                    updateAsiento(
                      "cuentaDebito",
                      (e.target as HTMLSelectElement).value,
                    )
                  }
                >
                  <option value="">Seleccionar cuenta…</option>
                  <option value="1105">1105 — Caja</option>
                  <option value="1110">1110 — Bancos</option>
                  <option value="1305">1305 — Clientes</option>
                </SelectComponent>
              </FormFieldComponent>
              <FormFieldComponent label="Valor débito" required>
                <InputComponent
                  type="number"
                  name="valorDebito"
                  prefix="$"
                  step="0.01"
                  placeholder="0.00"
                  value={asiento.valorDebito}
                  onInput={(e) =>
                    updateAsiento(
                      "valorDebito",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </FormFieldComponent>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormFieldComponent label="Cuenta crédito" required>
                <SelectComponent
                  name="cuentaCredito"
                  value={asiento.cuentaCredito}
                  onChange={(e) =>
                    updateAsiento(
                      "cuentaCredito",
                      (e.target as HTMLSelectElement).value,
                    )
                  }
                >
                  <option value="">Seleccionar cuenta…</option>
                  <option value="2105">2105 — Proveedores</option>
                  <option value="2365">2365 — Retención</option>
                  <option value="4135">4135 — Ingresos</option>
                </SelectComponent>
              </FormFieldComponent>
              <FormFieldComponent
                label="Valor crédito"
                required
                error={
                  debitoCreditorError
                    ? "Débito ≠ Crédito. Verifique."
                    : undefined
                }
              >
                <InputComponent
                  type="number"
                  name="valorCredito"
                  prefix="$"
                  step="0.01"
                  placeholder="0.00"
                  hasError={debitoCreditorError}
                  value={asiento.valorCredito}
                  onInput={(e) =>
                    updateAsiento(
                      "valorCredito",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </FormFieldComponent>
            </div>

            <FormFieldComponent
              label="Documento soporte"
              hint="Factura, recibo u otro documento soporte"
            >
              <InputComponent
                name="documentoSoporte"
                placeholder="FAC-0000 / REC-0000…"
                value={asiento.documentoSoporte}
                onInput={(e) =>
                  updateAsiento(
                    "documentoSoporte",
                    (e.target as HTMLInputElement).value,
                  )
                }
              />
            </FormFieldComponent>

            <div class="flex flex-wrap gap-4">
              <CheckboxComponent
                label="Guardar como borrador"
                name="borrador"
                checked={asiento.borrador}
                onChange={(e) =>
                  updateAsiento(
                    "borrador",
                    (e.target as HTMLInputElement).checked,
                  )
                }
              />
              <CheckboxComponent
                label="Requiere aprobación"
                name="requiereAprobacion"
                checked={asiento.requiereAprobacion}
                onChange={(e) =>
                  updateAsiento(
                    "requiereAprobacion",
                    (e.target as HTMLInputElement).checked,
                  )
                }
              />
            </div>

            <FormActionsComponent
              onCancel={() => route("/data-core/usuarios")}
              submitLabel="Guardar asiento"
              loading={loadingAsiento}
            />
          </FormCardComponent>
        </form>

        {/* ── Formulario Tercero ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitTercero();
          }}
        >
          <FormCardComponent title="Datos del Tercero">
            <FormFieldComponent label="Tipo de tercero">
              <div class="flex flex-wrap gap-4">
                {(["cliente", "proveedor", "ambos"] as const).map((t) => (
                  <RadioComponent
                    key={t}
                    label={t.charAt(0).toUpperCase() + t.slice(1)}
                    name="tipo"
                    value={t}
                    checked={tercero.tipo === t}
                    onChange={() => updateTercero("tipo", t)}
                  />
                ))}
              </div>
            </FormFieldComponent>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
              <FormFieldComponent label="Tipo doc.">
                <SelectComponent
                  name="tipoDoc"
                  value={tercero.tipoDoc}
                  onChange={(e) =>
                    updateTercero(
                      "tipoDoc",
                      (e.target as HTMLSelectElement).value,
                    )
                  }
                >
                  <option value="NIT">NIT</option>
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                </SelectComponent>
              </FormFieldComponent>
              <FormFieldComponent label="Número" required>
                <InputComponent
                  name="numeroDoc"
                  placeholder="900.123.456-7"
                  value={tercero.numeroDoc}
                  onInput={(e) =>
                    updateTercero(
                      "numeroDoc",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </FormFieldComponent>
            </div>

            <FormFieldComponent label="Razón social / Nombre" required>
              <InputComponent
                name="razonSocial"
                placeholder="Empresa S.A.S. o nombre completo"
                value={tercero.razonSocial}
                onInput={(e) =>
                  updateTercero(
                    "razonSocial",
                    (e.target as HTMLInputElement).value,
                  )
                }
              />
            </FormFieldComponent>

            <FormFieldComponent label="Correo electrónico">
              <InputComponent
                type="email"
                name="correo"
                placeholder="contacto@empresa.com"
                value={tercero.correo}
                onInput={(e) =>
                  updateTercero("correo", (e.target as HTMLInputElement).value)
                }
              />
            </FormFieldComponent>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormFieldComponent label="Teléfono">
                <InputComponent
                  type="tel"
                  name="telefono"
                  placeholder="+57 300 000 0000"
                  value={tercero.telefono}
                  onInput={(e) =>
                    updateTercero(
                      "telefono",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </FormFieldComponent>
              <FormFieldComponent label="Ciudad">
                <InputComponent
                  name="ciudad"
                  placeholder="Bucaramanga"
                  value={tercero.ciudad}
                  onInput={(e) =>
                    updateTercero(
                      "ciudad",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </FormFieldComponent>
            </div>

            <FormFieldComponent label="Observaciones">
              <TextareaComponent
                name="observaciones"
                placeholder="Notas internas sobre este tercero…"
                value={tercero.observaciones}
                onInput={(e) =>
                  updateTercero(
                    "observaciones",
                    (e.target as HTMLTextAreaElement).value,
                  )
                }
              />
            </FormFieldComponent>

            <div class="flex flex-wrap gap-4">
              <CheckboxComponent
                label="Activo"
                name="activo"
                checked={tercero.activo}
                onChange={(e) =>
                  updateTercero(
                    "activo",
                    (e.target as HTMLInputElement).checked,
                  )
                }
              />
              <CheckboxComponent
                label="Gran contribuyente"
                name="granContribuyente"
                checked={tercero.granContribuyente}
                onChange={(e) =>
                  updateTercero(
                    "granContribuyente",
                    (e.target as HTMLInputElement).checked,
                  )
                }
              />
              <CheckboxComponent
                label="Autorretenedor"
                name="autorretenedor"
                checked={tercero.autorretenedor}
                onChange={(e) =>
                  updateTercero(
                    "autorretenedor",
                    (e.target as HTMLInputElement).checked,
                  )
                }
              />
            </div>

            <FormActionsComponent
              onCancel={() => route("/data-core/usuarios")}
              submitLabel="Crear tercero"
              loading={loadingTercero}
            />
          </FormCardComponent>
        </form>
      </div>
    </div>
  );
}