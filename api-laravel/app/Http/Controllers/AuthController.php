<?php
namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\SessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(protected SessionService $sessionService)
    {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $token = Auth::guard('api')->attempt($request->validated());

        if (!$token) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        /** @var User $user */
        $user = Auth::guard('api')->user();

        if ($user->status !== 'active') {
            Auth::guard('api')->logout();
            return response()->json(['error' => 'Usuario inactivo o suspendido'], 403);
        }

        $this->sessionService->create($user->id, $token, $request);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => $this->formatUser($user),
        ]);
    }

    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();
        return response()->json($this->formatUser($user, detailed: true));
    }

    public function logout(Request $request): JsonResponse
    {
        $this->sessionService->revoke($request->bearerToken());
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function logoutAll(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();
        $this->sessionService->revokeAll($user->id);
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Todas las sesiones cerradas']);
    }

    private function formatUser(User $user, bool $detailed = false): array
    {
        $base = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'cargo' => $user->position?->name,
            'position' => $user->position?->name,
        ];

        if (!$detailed)
            return $base;

        return array_merge($base, [
            'programs' => $user->programs->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'role' => Role::find($p->pivot->role_id)?->label,
                'is_active' => (bool) $p->pivot->is_active,
                'permissions' => $user->getPermissionsForProgram($p->slug),
            ]),
        ]);
    }
}
