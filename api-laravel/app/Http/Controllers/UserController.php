<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
	protected $userService;

	// Inyección de dependencias del Servicio
	public function __construct(UserService $userService)
	{
		$this->userService = $userService;
	}

	public function index()
	{
		$users = $this->userService->getAllUsers();
		return response()->json($users);
	}

	public function store(StoreUserRequest $request)
	{
		$user = $this->userService->createUser($request->validated());
		return response()->json(['message' => 'Usuario creado', 'user' => $user], 201);
	}

	public function show(User $user)
	{
		return response()->json($user->load('role'));
	}

	public function update(Request $request, User $user)
	{
		// Validar aquí o crear un UpdateUserRequest
		$data = $request->validate([
			'name' => 'string',
			'role_id' => 'exists:roles,id'
		]);

		$updatedUser = $this->userService->updateUser($user, $data);
		return response()->json(['message' => 'Usuario actualizado', 'user' => $updatedUser]);
	}

	public function destroy(User $user)
	{
		$this->userService->deleteUser($user);
		return response()->json(['message' => 'Usuario eliminado']);
	}
}