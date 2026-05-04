<?php

namespace App\Http\Controllers\DataCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataCore\StoreUserRequest;
use App\Http\Requests\DataCore\UpdateUserRequest;
use App\Models\User;
use App\Services\DataCore\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected UserService $userService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $programSlug = $request->get('_program_slug', 'data-core');
        $users = $this->userService->paginate($programSlug);
        return response()->json($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());
        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load(['position', 'programs']));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $updated = $this->userService->update($user, $request->validated());
        return response()->json($updated);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    public function grantPermission(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
            'program_slug' => 'required|string|exists:suite_programs,slug',
        ]);

        $this->userService->grantPermission(
            $user,
            $request->permission,
            $request->program_slug
        );

        return response()->json(['message' => 'Permiso otorgado']);
    }

    public function revokePermission(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
            'program_slug' => 'required|string|exists:suite_programs,slug',
        ]);

        $this->userService->revokePermission(
            $user,
            $request->permission,
            $request->program_slug
        );

        return response()->json(['message' => 'Permiso revocado']);
    }
}
