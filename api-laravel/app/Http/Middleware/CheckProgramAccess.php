<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckProgramAccess
{
    public function handle(Request $request, Closure $next, string $programSlug): mixed
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

        $request->merge(['_program_slug' => $programSlug]);

        return $next($request);
    }
}
