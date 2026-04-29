<?php
namespace App\Http\Middleware;

use App\Services\SessionService;
use Closure;
use Illuminate\Http\Request;

class ValidateJwtSession
{
    public function __construct(protected SessionService $sessionService)
    {
    }

    public function handle(Request $request, Closure $next): mixed
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token requerido'], 401);
        }

        if (!$this->sessionService->validate($token)) {
            return response()->json(['error' => 'Sesión inválida o expirada'], 401);
        }

        return $next($request);
    }
}
