<?php
namespace App\Services\DataCore;

use App\Models\DataCore\Chart;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DataQueryService
{
    /**
     * Ejecuta la consulta SQL de una gráfica, inyectando los filtros proporcionados.
     * @param Chart $chart
     * @param array $filters key => value (según sql_placeholder)
     * @param array $parameters key => value (parámetros adicionales)
     * @return array ['columns' => [], 'rows' => [], 'execution_time_ms' => int]
     * @throws \Exception
     */
    public function execute(Chart $chart, array $filters = [], array $parameters = []): array
    {
        $start = microtime(true);
        $sql = $chart->sql_query;

        // Reemplazar placeholders de filtros
        foreach ($filters as $placeholder => $value) {
            // Prevenir inyección: los placeholders deben ser tipo :placeholder
            if (!preg_match('/^:[\w]+$/', $placeholder)) {
                throw new \Exception("Formato de placeholder inválido: {$placeholder}");
            }
            // Escapar según tipo (string o número)
            if (is_string($value)) {
                $escaped = DB::connection()->getPdo()->quote($value);
            } else {
                $escaped = $value;
            }
            $sql = str_replace($placeholder, $escaped, $sql);
        }

        // Reemplazar parámetros (tratamiento similar)
        foreach ($parameters as $key => $value) {
            if (!preg_match('/^:[\w]+$/', $key)) {
                throw new \Exception("Formato de parámetro inválido: {$key}");
            }
            if (is_string($value)) {
                $escaped = DB::connection()->getPdo()->quote($value);
            } else {
                $escaped = $value;
            }
            $sql = str_replace($key, $escaped, $sql);
        }

        // Ejecutar consulta
        try {
            $rows = DB::select($sql);
            $executionTime = (int) ((microtime(true) - $start) * 1000);
            $columns = !empty($rows) ? array_keys((array) $rows[0]) : [];

            return [
                'columns' => $columns,
                'rows' => $rows,
                'execution_time_ms' => $executionTime,
            ];
        } catch (\Exception $e) {
            Log::error("DataQueryService error: " . $e->getMessage(), [
                'chart_id' => $chart->id,
                'sql' => $sql,
                'filters' => $filters,
                'parameters' => $parameters,
            ]);
            throw new \Exception("Error ejecutando consulta: " . $e->getMessage());
        }
    }

    /**
     * Valida que una consulta SQL cumpla con las reglas de un tipo de gráfico.
     *
     * @param string $sql
     * @param int $chartTypeId
     * @throws \Exception
     */
    public function validateQuery(string $sql, int $chartTypeId): void
    {
        // Ejecutar una consulta de prueba con LIMIT 0 (no trae datos, pero valida sintaxis)
        try {
            DB::select("$sql LIMIT 0");
        } catch (\Exception $e) {
            throw new \Exception("Error de sintaxis SQL: " . $e->getMessage());
        }

        // Obtener metadatos de columnas (estructura)
        $stmt = DB::getPdo()->prepare("$sql LIMIT 0");
        $stmt->execute();
        $columnCount = $stmt->columnCount();
        $columnNames = [];
        for ($i = 0; $i < $columnCount; $i++) {
            $colMeta = $stmt->getColumnMeta($i);
            $columnNames[] = $colMeta['name'] ?? "col_$i";
        }

        // Obtener reglas del tipo de gráfico
        $type = \App\Models\DataCore\ChartType::with('rules')->findOrFail($chartTypeId);
        $rules = $type->rules->pluck('rule_value', 'rule_key');

        // Validar reglas
        if ($rules->has('min_columns') && $columnCount < (int) $rules['min_columns']) {
            throw new \Exception("La consulta debe devolver al menos {$rules['min_columns']} columnas. Se encontraron $columnCount.");
        }

        if ($rules->has('exactly_two_columns') && $columnCount != 2) {
            throw new \Exception("El tipo de gráfico '$type->label' requiere exactamente 2 columnas (categoría y valor).");
        }

        if ($rules->has('exactly_one_column') && $columnCount != 1) {
            throw new \Exception("El tipo de gráfico '$type->label' requiere exactamente 1 columna numérica.");
        }

        if ($rules->has('value_column_numeric')) {
            // Para simplificar, verificamos la última columna (o la que se usaría para valor)
            $lastCol = end($columnNames);
            // Hacemos una pequeña consulta para inferir el tipo de columna
            $sample = DB::select("SELECT $lastCol FROM ($sql) as subquery LIMIT 1");
            if (!empty($sample) && !is_numeric($sample[0]->$lastCol)) {
                throw new \Exception("La columna de valores ('$lastCol') debe ser numérica.");
            }
        }

        if ($rules->has('has_time_category')) {
            // Verificar que alguna columna sea de tipo fecha (difícil sin datos, se omite en esta versión)
            // Se puede implementar más adelante.
        }
    }
}
