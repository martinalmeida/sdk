<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGroupRequest;
use App\Http\Requests\Admin\UpdateGroupRequest;
use App\Models\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(): JsonResponse
    {
        $groups = Group::with('users')->get();
        return response()->json($groups);
    }

    public function store(StoreGroupRequest $request): JsonResponse
    {
        $group = Group::create($request->validated());
        return response()->json($group, 201);
    }

    public function show(Group $group): JsonResponse
    {
        return response()->json($group->load('users'));
    }

    public function update(UpdateGroupRequest $request, Group $group): JsonResponse
    {
        $group->update($request->validated());
        return response()->json($group);
    }

    public function destroy(Group $group): JsonResponse
    {
        $group->delete();
        return response()->json(['message' => 'Grupo eliminado']);
    }

    // Asignar usuarios a grupo
    public function assignUsers(Request $request, Group $group): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);
        $group->users()->syncWithoutDetaching($request->user_ids);
        return response()->json(['message' => 'Usuarios asignados']);
    }

    // Remover usuarios del grupo
    public function removeUsers(Request $request, Group $group): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);
        $group->users()->detach($request->user_ids);
        return response()->json(['message' => 'Usuarios removidos']);
    }
}
