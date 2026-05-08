<?php

namespace App\Http\Controllers\AdminCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCore\StoreProgramRequest;
use App\Http\Requests\AdminCore\UpdateProgramRequest;
use App\Models\AdminCore\SuiteProgram;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    public function index(): JsonResponse
    {
        $programs = SuiteProgram::all();
        return response()->json($programs);
    }

    public function store(StoreProgramRequest $request): JsonResponse
    {
        $program = SuiteProgram::create($request->validated());
        return response()->json($program, 201);
    }

    public function show(SuiteProgram $program): JsonResponse
    {
        return response()->json($program);
    }

    public function update(UpdateProgramRequest $request, SuiteProgram $program): JsonResponse
    {
        $program->update($request->validated());
        return response()->json($program);
    }

    public function destroy(SuiteProgram $program): JsonResponse
    {
        $program->delete();
        return response()->json(['message' => 'Programa eliminado']);
    }
}
