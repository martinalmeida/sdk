<?php

namespace App\Http\Controllers\AdminCore;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCore\AssignProgramRequest;
use App\Http\Requests\AdminCore\StoreUserRequest;
use App\Http\Requests\AdminCore\UpdateUserRequest;
use App\Models\AdminCore\User;
use App\Services\AdminCore\AdminUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected AdminUserService $userService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->paginate($request->get('per_page', 15));
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
        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function assignProgram(AssignProgramRequest $request, User $user): JsonResponse
    {
        $this->userService->assignProgram(
            $user,
            $request->program_id,
            $request->role_id,
            $request->is_active ?? true
        );
        return response()->json(['message' => 'Programa asignado']);
    }

    public function removeProgram(User $user, int $programId): JsonResponse
    {
        $this->userService->removeProgram($user, $programId);
        return response()->json(['message' => 'Programa removido']);
    }
}
