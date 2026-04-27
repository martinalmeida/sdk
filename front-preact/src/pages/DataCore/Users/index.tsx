import { useState, useEffect } from "preact/hooks";
import DataTableComponent from "../Core/components/DatatableComponent";
import LoaderComponent from "../Core/components/LoaderComponent";
import { Pencil, MoreVertical } from "lucide-preact";
import { setPageTitle } from "../Core/hooks";

const columns = [
  { key: "fecha", label: "Fecha" },
  { key: "cuenta", label: "Cta." },
  { key: "descripcion", label: "Descripción" },
  { key: "debito", label: "Débito", align: "right" as const },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acc." },
];

const data = [
  {
    fecha: "01/04/25",
    cuenta: "1105",
    descripcion: "Caja general — apertura",
    debito: "10,000.00",
    estado: (
      <span class="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
        Aprobado
      </span>
    ),
    acciones: (
      <div class="flex gap-2">
        <a
          href={`/data-core/usuarios/editar/${22}`}
          class="rounded-md bg-stone-100 px-2 py-1 text-xs hover:bg-stone-200"
        >
          <Pencil size={12} />
        </a>
        <a class="rounded-md bg-stone-100 px-2 py-1 text-xs hover:bg-stone-200">
          <MoreVertical size={12} />
        </a>
      </div>
    ),
  },
];

export default function Users() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle("Usuarios", "Gestión de usuarios del sistema");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoaderComponent message="Cargando usuarios..." />;

  return (
    <DataTableComponent
      columns={columns}
      data={data}
      pageSize={10}
      searchKeys={["fecha", "cuenta", "descripcion"]}
    />
  );
}