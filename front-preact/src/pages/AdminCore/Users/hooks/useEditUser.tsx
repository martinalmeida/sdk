import { useState } from "preact/hooks";

export interface AsientoForm {
  fecha: string;
  descripcion: string;
  cuentaDebito: string;
  valorDebito: string;
  cuentaCredito: string;
  valorCredito: string;
  documentoSoporte: string;
  borrador: boolean;
  requiereAprobacion: boolean;
}

export interface TerceroForm {
  tipo: "cliente" | "proveedor" | "ambos";
  tipoDoc: string;
  numeroDoc: string;
  razonSocial: string;
  correo: string;
  telefono: string;
  ciudad: string;
  observaciones: string;
  activo: boolean;
  granContribuyente: boolean;
  autorretenedor: boolean;
}

const defaultAsiento: AsientoForm = {
  fecha: new Date().toISOString().split("T")[0],
  descripcion: "",
  cuentaDebito: "",
  valorDebito: "",
  cuentaCredito: "",
  valorCredito: "",
  documentoSoporte: "",
  borrador: true,
  requiereAprobacion: false,
};

const defaultTercero: TerceroForm = {
  tipo: "cliente",
  tipoDoc: "NIT",
  numeroDoc: "",
  razonSocial: "",
  correo: "",
  telefono: "",
  ciudad: "",
  observaciones: "",
  activo: true,
  granContribuyente: false,
  autorretenedor: false,
};

export function useEditUser() {
  const [asiento, setAsiento] = useState<AsientoForm>(defaultAsiento);
  const [tercero, setTercero] = useState<TerceroForm>(defaultTercero);
  const [loadingAsiento, setLoadingAsiento] = useState(false);
  const [loadingTercero, setLoadingTercero] = useState(false);

  const debitoCreditorError =
    asiento.valorDebito !== "" &&
    asiento.valorCredito !== "" &&
    asiento.valorDebito !== asiento.valorCredito;

  function updateAsiento<K extends keyof AsientoForm>(
    key: K,
    value: AsientoForm[K],
  ) {
    setAsiento((prev) => ({ ...prev, [key]: value }));
  }

  function updateTercero<K extends keyof TerceroForm>(
    key: K,
    value: TerceroForm[K],
  ) {
    setTercero((prev) => ({ ...prev, [key]: value }));
  }

  async function submitAsiento() {
    setLoadingAsiento(true);
    try {
      console.log("Asiento a guardar:", asiento);
      // await api.post('/asientos', asiento);
    } finally {
      setLoadingAsiento(false);
    }
  }

  async function submitTercero() {
    setLoadingTercero(true);
    try {
      console.log("Tercero a guardar:", tercero);
      // await api.post('/terceros', tercero);
    } finally {
      setLoadingTercero(false);
    }
  }

  return {
    asiento,
    updateAsiento,
    submitAsiento,
    loadingAsiento,
    tercero,
    updateTercero,
    submitTercero,
    loadingTercero,
    debitoCreditorError,
  };
}