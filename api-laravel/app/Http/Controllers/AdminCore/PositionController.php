<?php

namespace App\Http\Controllers\AdminCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCore\StorePositionRequest;
use App\Http\Requests\AdminCore\UpdatePositionRequest;
use App\Models\AdminCore\Position;
use Illuminate\Http\JsonResponse;

class PositionController extends Controller
{
    public function index(): JsonResponse
    {
        $positions = Position::all();
        return response()->json($positions);
    }

    public function store(StorePositionRequest $request): JsonResponse
    {
        $position = Position::create($request->validated());
        return response()->json($position, 201);
    }

    public function show(Position $position): JsonResponse
    {
        return response()->json($position);
    }

    public function update(UpdatePositionRequest $request, Position $position): JsonResponse
    {
        $position->update($request->validated());
        return response()->json($position);
    }

    public function destroy(Position $position): JsonResponse
    {
        $position->delete();
        return response()->json(['message' => 'Cargo eliminado']);
    }
}
