import { useEffect } from "preact/hooks";
import { setPageTitle } from "../Core/hooks/useLayout";

import NoticeComponent from "../Core/components/NoticeComponent";
import StatsComponent from "../Core/components/StatsComponent";

export default function Home() {
  useEffect(() => {
    setPageTitle("Dashboard", "Panel principal");
  }, []);

  const stats = [
    {
      label: "Ingresos del mes",
      value: "$48,320.00",
      valueTone: "text-green-700",
      badge: "↑ 12.4%",
      badgeClass: "bg-green-100 text-green-700",
      note: "vs mes ant.",
    },
    {
      label: "Egresos del mes",
      value: "$31,750.00",
      valueTone: "text-red-700",
      badge: "↑ 3.1%",
      badgeClass: "bg-red-100 text-red-700",
      note: "vs mes ant.",
    },
    {
      label: "Utilidad neta",
      value: "$16,570.00",
      valueTone: "text-blue-700",
      badge: "Margen 34%",
      badgeClass: "bg-blue-100 text-blue-700",
    },
    {
      label: "Por cobrar",
      value: "$9,100.00",
      valueTone: "text-amber-700",
      badge: "7 facturas",
      badgeClass: "bg-amber-100 text-amber-700",
    },
  ];

  const reminders = [
    {
      variant: "warning",
      icon: "📌",
      title: "IVA bimestral",
      description: "Presentar antes del 12 de mayo. Período feb–abr 2025.",
    },
    {
      variant: "info",
      icon: "ℹ️",
      title: "Cierre Q1",
      description:
        "El período cierra el 30 de abril. Verifique todos los estados.",
    },
    {
      variant: "danger",
      icon: "⚠️",
      title: "Auditoría activa",
      description:
        "No modifique asientos de marzo sin autorización del revisor.",
    },
  ] as const;

  return (
    <section class="space-y-4">
      <NoticeComponent
        variant="warning"
        icon="⚠️"
        title="3 retenciones"
        description="vencen el 20 de abril. Realice el pago antes de la fecha límite para evitar sanciones."
      />

      <StatsComponent items={stats} />

      <div class="rounded-xl border border-stone-200 bg-white p-4">
        <p class="mb-4 text-[13.5px] font-semibold text-stone-900">
          Recordatorios
        </p>

        <div class="space-y-2">
          {reminders.map((item) => (
            <NoticeComponent
              key={item.title}
              variant={item.variant}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
