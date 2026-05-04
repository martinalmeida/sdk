<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminUserService
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::with(['position', 'programs', 'permissions'])
            ->paginate($perPage);
    }

    public function create(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'position_id' => $data['position_id'] ?? null,
            'status' => $data['status'] ?? 'active',
        ]);

        return $user->load(['position', 'programs', 'permissions']);
    }

    public function update(User $user, array $data): User
    {
        $user->update(array_filter([
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'password' => $data['password'] ?? null,
            'position_id' => $data['position_id'] ?? null,
            'status' => $data['status'] ?? null,
        ], fn($v) => !is_null($v)));

        return $user->fresh(['position', 'programs', 'permissions']);
    }

    public function assignProgram(User $user, int $programId, int $roleId, bool $isActive = true): void
    {
        $user->programs()->syncWithoutDetaching([
            $programId => [
                'role_id' => $roleId,
                'is_active' => $isActive,
                'granted_at' => now(),
            ],
        ]);
    }

    public function removeProgram(User $user, int $programId): void
    {
        $user->programs()->detach($programId);
    }

    public function grantPermission(User $user, int $permissionId, int $programId): void
    {
        $user->permissions()->syncWithoutDetaching([
            $permissionId => ['program_id' => $programId, 'granted' => true],
        ]);
    }

    public function revokePermission(User $user, int $permissionId, int $programId): void
    {
        $user->permissions()->syncWithoutDetaching([
            $permissionId => ['program_id' => $programId, 'granted' => false],
        ]);
    }
}
