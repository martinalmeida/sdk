<?php

namespace App\Http\Controllers\DataCore;

use App\Http\Controllers\Controller;
use App\Models\DataCore\Chart;
use App\Models\DataCore\ChartExecutionLog;
use App\Services\DataCore\DataQueryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChartExecutionController extends Controller
{
    protected DataQueryService $queryService;

    public function __construct(DataQueryService $queryService)
    {
        $this->queryService = $queryService;
    }

    /**
     * Ejecutar una gráfica y devolver los datos (post con filtros)
     */
    public function execute(Request $request, Chart $chart)
    {
        // La autorización se maneja en las rutas con middleware 'role:admin_data_core,data-core'
        $filters = $request->input('filters', []);
        $params = $request->input('params', []);

        $result = $this->queryService->execute($chart, $filters, $params);

        // Registrar log
        $chart->executionLogs()->create([
            'user_id' => Auth::id(),
            'dashboard_id' => $request->input('dashboard_id'),
            'applied_filters' => json_encode($filters),
            'execution_time_ms' => $result['execution_time_ms'] ?? null,
            'rows_returned' => count($result['rows']),
            'status' => 'success',
            'error_message' => null,
            'executed_at' => now(),
        ]);

        return response()->json($result);
    }

    /**
     * Validar SQL de una gráfica (antes de guardar)
     */
    public function validateSql(Request $request, ?Chart $chart = null)
    {
        $request->validate([
            'sql_query' => 'required|string',
            'chart_type_id' => 'required|exists:dc_chart_types,id',
        ]);

        try {
            $this->queryService->validateQuery(
                $request->sql_query,
                $request->chart_type_id
            );
            return response()->json(['valid' => true]);
        } catch (\Exception $e) {
            return response()->json(['valid' => false, 'error' => $e->getMessage()], 422);
        }
    }

    public function logs(Request $request, ?Chart $chart = null)
    {
        $query = ChartExecutionLog::with(['chart', 'user']);
        if ($chart) {
            $query->where('chart_id', $chart->id);
        }
        if ($request->has('start_date')) {
            $query->where('executed_at', '>=', $request->start_date);
        }
        return response()->json($query->orderBy('executed_at', 'desc')->paginate(50));
    }
}
