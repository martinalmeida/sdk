<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
	protected UserService $userService;

	public function __construct(UserService $userService)
	{
		$this->userService = $userService;
	}

	public function login(LoginRequest $request): JsonResponse
	{
		$credentials = $request->validated();
		$token = $this->userService->login($credentials);

		if (!$token) {
			return response()->json(['error' => 'Credenciales inválidas'], 401);
		}

		return $this->respondWithToken($token);
	}

	public function me(): JsonResponse
	{
		return response()->json(Auth::guard('api')->user());
	}

	public function logout(): JsonResponse
	{
		Auth::guard('api')->logout();
		return response()->json(['message' => 'Sesión cerrada correctamente']);
	}

	protected function respondWithToken(string $token): JsonResponse
	{
		/** @var \PHPOpenSourceSaver\JWTAuth\JWT $authFactory */
		$authFactory = Auth::guard('api');

		return response()->json([
			'access_token' => $token,
			'token_type' => 'bearer',
			'expires_in' => config('jwt.ttl') * 60,
			'user' => $authFactory->user()
		]);
	}
}
