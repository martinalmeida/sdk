<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $roleName, string $programSlug)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!$user->canAccessProgram($programSlug)) {
            return response()->json([
                'error' => 'Sin acceso a este programa',
                'program' => $programSlug,
            ], 403);
        }

        $role = $user->getRoleForProgram($programSlug);

        if (!$role || $role->name !== $roleName) {
            return response()->json([
                'error' => 'Rol insuficiente. Se requiere: ' . $roleName,
            ], 403);
        }

        return $next($request);
    }
}
