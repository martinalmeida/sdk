<?php

namespace App\Http\Controllers\DataCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataCore\StoreDashboardRequest;
use App\Http\Requests\DataCore\UpdateDashboardRequest;
use App\Http\Requests\DataCore\AddChartToDashboardRequest;
use App\Models\DataCore\Dashboard;
use App\Models\DataCore\DashboardChart;
use App\Services\DataCore\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Listar tableros del programa actual (accesibles para el usuario)
     */
    public function index(Request $request): JsonResponse
    {
        $programSlug = $request->input('_program_slug', 'data-core');
        $dashboards = $this->dashboardService->getAccessibleDashboards($request->user(), $programSlug);
        return response()->json($dashboards);
    }

    /**
     * Crear un tablero
     */
    public function store(StoreDashboardRequest $request): JsonResponse
    {
        $dashboard = $this->dashboardService->create($request->validated());
        return response()->json($dashboard, 201);
    }

    /**
     * Mostrar un tablero con sus gráficas y configuraciones
     */
    public function show(Dashboard $dashboard): JsonResponse
    {
        $dashboard->load([
            'dashboardCharts.chart',
            'users',
            'groups'
        ]);
        return response()->json($dashboard);
    }

    /**
     * Actualizar tablero
     */
    public function update(UpdateDashboardRequest $request, Dashboard $dashboard): JsonResponse
    {
        $updated = $this->dashboardService->update($dashboard, $request->validated());
        return response()->json($updated);
    }

    /**
     * Eliminar tablero
     */
    public function destroy(Dashboard $dashboard): JsonResponse
    {
        $dashboard->delete();
        return response()->json(['message' => 'Tablero eliminado']);
    }

    /**
     * Agregar una gráfica existente al tablero
     */
    public function addChart(AddChartToDashboardRequest $request, Dashboard $dashboard): JsonResponse
    {
        $dashboardChart = $this->dashboardService->addChart($dashboard, $request->validated());
        return response()->json($dashboardChart, 201);
    }

    /**
     * Remover una gráfica del tablero
     */
    public function removeChart(Dashboard $dashboard, DashboardChart $dashboardChart): JsonResponse
    {
        $dashboardChart->delete();
        return response()->json(['message' => 'Gráfica removida del tablero']);
    }

    /**
     * Actualizar posición/configuración de una gráfica dentro del tablero
     */
    public function updateChartPosition(Request $request, Dashboard $dashboard, DashboardChart $dashboardChart): JsonResponse
    {
        $request->validate([
            'position_x' => 'integer|min:0',
            'position_y' => 'integer|min:0',
            'width' => 'integer|min:1|max:12',
            'height' => 'integer|min:1',
            'override_config' => 'nullable|array',
        ]);
        $dashboardChart->update($request->only(['position_x', 'position_y', 'width', 'height', 'override_config']));
        return response()->json($dashboardChart);
    }
}
