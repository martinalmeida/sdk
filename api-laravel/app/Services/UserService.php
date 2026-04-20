<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserService
{
	/**
	 * Lógica de inicio de sesión JWT.
	 */
	public function login(array $credentials): ?string
	{
		// Intentamos autenticar con el guard 'api' (JWT)
		$token = Auth::guard('api')->attempt($credentials);

		return $token ?: null;
	}

	public function getAllUsers()
	{
		return User::with('role')->paginate(10);
	}

	public function createUser(array $data): User
	{
		return DB::transaction(function () use ($data) {
			return User::create($data);
		});
	}

	public function getUserById(int $id): User
	{
		return User::with('role')->findOrFail($id);
	}

	public function updateUser(User $user, array $data): User
	{
		return DB::transaction(function () use ($user, $data) {
			if (isset($data['password'])) {
				$data['password'] = Hash::make($data['password']);
			}

			$user->update($data);
			return $user->refresh();
		});
	}

	public function deleteUser(User $user): bool
	{
		return $user->delete();
	}
}