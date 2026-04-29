<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission, string $programSlug): mixed
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!$user->hasPermission($permission, $programSlug)) {
            return response()->json([
                'error' => 'Sin permiso para esta acción',
                'permission' => $permission,
            ], 403);
        }

        return $next($request);
    }
}
