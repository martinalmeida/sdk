<?php

namespace App\Services\DataCore;

use App\Models\Permission;
use App\Models\SuiteProgram;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function paginate(string $programSlug, int $perPage = 15): LengthAwarePaginator
    {
        return User::with(['position', 'programs'])
            ->whereHas('programs', fn($q) => $q->where('slug', $programSlug))
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

        $user->programs()->attach($data['program_id'], [
            'role_id' => $data['role_id'],
            'is_active' => true,
            'granted_at' => now(),
        ]);

        return $user->load(['position', 'programs']);
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

        return $user->fresh(['position', 'programs']);
    }

    public function grantPermission(User $user, string $permissionName, string $programSlug): void
    {
        $permission = Permission::where('name', $permissionName)->firstOrFail();
        $programId = SuiteProgram::where('slug', $programSlug)->value('id');

        $user->permissions()->syncWithoutDetaching([
            $permission->id => ['program_id' => $programId, 'granted' => true],
        ]);
    }

    public function revokePermission(User $user, string $permissionName, string $programSlug): void
    {
        $permission = Permission::where('name', $permissionName)->firstOrFail();
        $programId = SuiteProgram::where('slug', $programSlug)->value('id');

        $user->permissions()->syncWithoutDetaching([
            $permission->id => ['program_id' => $programId, 'granted' => false],
        ]);
    }
}
