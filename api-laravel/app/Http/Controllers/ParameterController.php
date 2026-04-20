<?php

namespace App\Http\Controllers;

use App\Services\ParameterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParameterController extends Controller
{
    protected ParameterService $parameterService;

    public function __construct(ParameterService $parameterService)
    {
        $this->parameterService = $parameterService;
    }

    public function getDocumentTypes(): JsonResponse
    {
        return response()->json($this->parameterService->getDocumentTypes());
    }

    public function getGenders(): JsonResponse
    {
        return response()->json($this->parameterService->getGenders());
    }

    public function getDepartments(): JsonResponse
    {
        return response()->json($this->parameterService->getDepartments());
    }

    public function getMunicipalities(Request $request): JsonResponse
    {
        // Captura el department_id de la URL si existe (?department_id=X)
        $departmentId = $request->query('department_id');
        return response()->json($this->parameterService->getMunicipalities($departmentId));
    }
}