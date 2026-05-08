<?php

namespace App\Http\Controllers\AdminCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCore\StoreRoleRequest;
use App\Http\Requests\AdminCore\UpdateRoleRequest;
use App\Models\AdminCore\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Role::with('program');
        if ($request->has('program_id')) {
            $query->where('program_id', $request->program_id);
        }
        $roles = $query->get();
        return response()->json($roles);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = Role::create($request->validated());
        return response()->json($role, 201);
    }

    public function show(Role $role): JsonResponse
    {
        return response()->json($role->load('program'));
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $role->update($request->validated());
        return response()->json($role);
    }

    public function destroy(Role $role): JsonResponse
    {
        $role->delete();
        return response()->json(['message' => 'Rol eliminado']);
    }
}
