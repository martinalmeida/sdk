import { useState, useEffect } from "preact/hooks";
import { chartsApi } from "../services";
import { chartTypesApi } from "../../ChartTypes/services";
import { pushToast } from "../../../../tools/alerts";

export function useChartForm(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingChart, setEditingChart] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chartTypeId, setChartTypeId] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [xAxisColumn, setXAxisColumn] = useState("");
  const [yAxisColumn, setYAxisColumn] = useState("");
  const [seriesColumn, setSeriesColumn] = useState("");
  const [labelColumn, setLabelColumn] = useState("");
  const [status, setStatus] = useState("draft");
  const [isPublic, setIsPublic] = useState(false);
  const [styleConfig, setStyleConfig] = useState({});

  const [chartTypes, setChartTypes] = useState<any[]>([]);
  const [validating, setValidating] = useState(false);
  const [sqlValid, setSqlValid] = useState<boolean | null>(null);
  const [sqlError, setSqlError] = useState("");

  const loadChartTypes = async () => {
    const res = await chartTypesApi.getChartTypes();
    if (res.data) setChartTypes(res.data);
  };

  const validateSql = async () => {
    if (!sqlQuery || !chartTypeId) return;
    setValidating(true);
    const res = await chartsApi.validateSql(sqlQuery, parseInt(chartTypeId));
    if (res.data?.valid) {
      setSqlValid(true);
    } else {
      setSqlValid(false);
      setSqlError(res.error || "SQL inválida");
    }
    setValidating(false);
  };

  useEffect(() => {
    loadChartTypes();
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    } else if (editingChart) {
      setName(editingChart.name);
      setDescription(editingChart.description || "");
      setChartTypeId(editingChart.chart_type_id.toString());
      setSqlQuery(editingChart.sql_query);
      setXAxisColumn(editingChart.x_axis_column || "");
      setYAxisColumn(editingChart.y_axis_column || "");
      setSeriesColumn(editingChart.series_column || "");
      setLabelColumn(editingChart.label_column || "");
      setStatus(editingChart.status);
      setIsPublic(editingChart.is_public);
      setStyleConfig(editingChart.style_config || {});
    }
  }, [open, editingChart]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setChartTypeId("");
    setSqlQuery("");
    setXAxisColumn("");
    setYAxisColumn("");
    setSeriesColumn("");
    setLabelColumn("");
    setStatus("draft");
    setIsPublic(false);
    setStyleConfig({});
    setEditingChart(null);
    setSqlValid(null);
    setSqlError("");
  };

  const handleSubmit = async () => {
    if (!name || !sqlQuery || !chartTypeId) {
      pushToast("Nombre, SQL y tipo de gráfico son obligatorios", "warning");
      return;
    }
    if (sqlValid !== true) {
      pushToast("Debe validar la SQL antes de guardar", "warning");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      description: description || null,
      chart_type_id: parseInt(chartTypeId),
      sql_query: sqlQuery,
      x_axis_column: xAxisColumn || null,
      y_axis_column: yAxisColumn || null,
      series_column: seriesColumn || null,
      label_column: labelColumn || null,
      status,
      is_public: isPublic,
      style_config: JSON.stringify(styleConfig), // ← Laravel espera JSON string
      program_id: 1, // ← agrega esto, o pásalo como parámetro del hook
    };

    const res = editingChart
      ? await chartsApi.updateChart(editingChart.id, payload)
      : await chartsApi.createChart(payload);

    if (res.errors) {
      // Muestra cada error de validación como toast individual
      Object.entries(res.errors).forEach(([field, messages]) => {
        (messages as string[]).forEach((msg) => pushToast(`${msg}`, "error"));
      });
      setLoading(false);
      return;
    }

    if (res.error) {
      pushToast(res.error, "error");
      setLoading(false);
      return;
    }

    setOpen(false);
    onSuccess();
    pushToast(
      editingChart
        ? "Gráfica actualizada correctamente"
        : "Gráfica creada correctamente",
      "success",
    );

    setLoading(false);
  };

  const openCreate = () => {
    setEditingChart(null);
    setOpen(true);
  };

  const openEdit = (chart: any) => {
    setEditingChart(chart);
    setOpen(true);
  };

  const resetValidation = () => {
    setSqlValid(null);
    setSqlError("");
  };

  const loadChart = async (id: number) => {
    setLoading(true);
    const res = await chartsApi.getChart(id);
    if (res.data) {
      openEdit(res.data);
    } else {
      pushToast(res.error || "Error al cargar la gráfica", "error");
    }
    setLoading(false);
  };

  return {
    open,
    setOpen,
    loading,
    editingChart,
    name,
    setName,
    description,
    setDescription,
    chartTypeId,
    setChartTypeId,
    sqlQuery,
    setSqlQuery,
    xAxisColumn,
    setXAxisColumn,
    yAxisColumn,
    setYAxisColumn,
    seriesColumn,
    setSeriesColumn,
    labelColumn,
    setLabelColumn,
    status,
    setStatus,
    isPublic,
    setIsPublic,
    styleConfig,
    setStyleConfig,
    chartTypes,
    validating,
    sqlValid,
    sqlError,
    validateSql,
    handleSubmit,
    openCreate,
    openEdit,
    setSqlValid,
    setSqlError,
    resetValidation,
    loadChart,
  };
}
