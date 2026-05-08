<?php
namespace App\Http\Controllers\DataCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataCore\StoreChartRequest;
use App\Http\Requests\DataCore\UpdateChartRequest;
use App\Models\DataCore\Chart;
use App\Models\AdminCore\SuiteProgram;
use App\Services\DataCore\DataQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChartController extends Controller
{
    public function __construct(protected DataQueryService $queryService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $programSlug = $request->query('_program_slug', 'data-core');
        $program = SuiteProgram::where('slug', $programSlug)->firstOrFail();
        $charts = Chart::with(['chartType', 'creator'])
            ->where('program_id', $program->id)
            ->get();
        return response()->json($charts);
    }

    public function store(StoreChartRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;
        $chart = Chart::create($data);
        // Guardar filtros y parámetros si vienen en la request
        // (esto se puede ampliar después)
        return response()->json($chart, 201);
    }

    public function show(Chart $chart): JsonResponse
    {
        return response()->json($chart->load(['chartType', 'chartFilters', 'parameters']));
    }

    public function update(UpdateChartRequest $request, Chart $chart): JsonResponse
    {
        $chart->update($request->validated());
        return response()->json($chart);
    }

    public function destroy(Chart $chart): JsonResponse
    {
        $chart->delete();
        return response()->json(['message' => 'Gráfica eliminada']);
    }

    public function execute(Request $request, Chart $chart): JsonResponse
    {
        $filters = $request->input('filters', []);
        $parameters = $request->input('parameters', []);
        try {
            $result = $this->queryService->execute($chart, $filters, $parameters);
            // Registrar log
            $chart->executionLogs()->create([
                'user_id' => $request->user()->id,
                'applied_filters' => $filters,
                'execution_time_ms' => $result['execution_time_ms'],
                'rows_returned' => count($result['rows']),
                'status' => 'success',
                'executed_at' => now(),
            ]);
            return response()->json($result);
        } catch (\Exception $e) {
            $chart->executionLogs()->create([
                'user_id' => $request->user()->id,
                'applied_filters' => $filters,
                'status' => 'error',
                'error_message' => $e->getMessage(),
                'executed_at' => now(),
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
