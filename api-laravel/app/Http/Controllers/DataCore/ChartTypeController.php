<?php
namespace App\Http\Controllers\DataCore;

use App\Http\Controllers\Controller;
use App\Models\DataCore\ChartType;
use Illuminate\Http\JsonResponse;

class ChartTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $types = ChartType::with(['rules', 'filters'])->get();
        return response()->json($types);
    }

    public function show(ChartType $chartType): JsonResponse
    {
        return response()->json($chartType->load(['rules', 'filters']));
    }
}
