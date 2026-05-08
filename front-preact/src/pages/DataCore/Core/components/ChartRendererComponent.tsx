import { useEffect, useRef } from "preact/hooks";
import Chart from "chart.js/auto";

interface Props {
  type: "bar" | "line" | "pie";
  data: any[];
  columns: string[];
  xAxisColumn?: string;
  yAxisColumn?: string;
  seriesColumn?: string;
}

export default function ChartRendererComponent({
  type,
  data,
  columns,
  xAxisColumn,
  yAxisColumn,
  seriesColumn,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    let labels: string[] = [];
    let datasets: any[] = [];

    if (type === "pie") {
      const categories = data.map((row) => row[columns[0]]);
      const values = data.map((row) => row[columns[1]]);
      datasets = [
        {
          data: values,
          backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
        },
      ];
      labels = categories;
    } else if (type === "bar" || type === "line") {
      if (seriesColumn && data[0]?.[seriesColumn]) {
        // múltiples series
        const uniqueSeries = [...new Set(data.map((row) => row[seriesColumn]))];
        const uniqueCategory = [
          ...new Set(data.map((row) => row[xAxisColumn || columns[0]])),
        ];
        labels = uniqueCategory;
        datasets = uniqueSeries.map((serie) => ({
          label: serie,
          data: uniqueCategory.map((cat) => {
            const row = data.find(
              (r) =>
                r[seriesColumn] === serie &&
                r[xAxisColumn || columns[0]] === cat,
            );
            return row ? row[yAxisColumn || columns[1]] : 0;
          }),
        }));
      } else {
        labels = data.map((row) => row[xAxisColumn || columns[0]]);
        const values = data.map((row) => row[yAxisColumn || columns[1]]);
        datasets = [{ label: "Valores", data: values }];
      }
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: type,
      data: { labels, datasets },
      options: { responsive: true, maintainAspectRatio: true },
    });

    return () => chartRef.current?.destroy();
  }, [data, type, columns, xAxisColumn, yAxisColumn, seriesColumn]);

  return <canvas ref={canvasRef} />;
}
