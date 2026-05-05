<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'position_id',
        'status',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //Relaciones

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function programs(): BelongsToMany
    {
        return $this->belongsToMany(
            SuiteProgram::class,
            'user_programs',
            'user_id',
            'program_id'
        )
            ->withPivot(['role_id', 'is_active', 'granted_at'])
            ->withTimestamps();
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'user_permissions', //tabla pivot
            'user_id',          //FK del modelo actual
            'permission_id'     //FK del modelo relacionado
        )
            ->withPivot(['granted', 'program_id'])
            ->withTimestamps();
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_user')->withTimestamps();
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(UserSession::class);
    }

    //Helpers de acceso

    public function isSuperAdmin(): bool
    {
        return $this->programs()
            ->join('roles', 'roles.id', '=', 'user_programs.role_id')
            ->where('roles.is_global', true)
            ->where('user_programs.is_active', true)
            ->exists();
    }

    public function canAccessProgram(string $programSlug): bool
    {
        if ($this->isSuperAdmin())
            return true;

        return $this->programs()
            ->where('slug', $programSlug)
            ->where('user_programs.is_active', true)
            ->exists();
    }

    public function getRoleForProgram(string $programSlug): ?Role
    {
        $program = $this->programs()
            ->where('slug', $programSlug)
            ->where('user_programs.is_active', true)
            ->first();

        return $program ? Role::find($program->pivot->role_id) : null;
    }

    public function hasPermission(string $permissionName, ?string $programSlug = null): bool
    {
        if ($this->isSuperAdmin())
            return true;

        $permission = Permission::where('name', $permissionName)->first();
        if (!$permission)
            return false;

        $programId = $programSlug
            ? SuiteProgram::where('slug', $programSlug)->value('id')
            : null;

        $userPermission = $this->permissions()
            ->where('permission_id', $permission->id)
            ->where('program_id', $programId)
            ->first();

        if (!$userPermission)
            return false;

        return (bool) $userPermission->pivot->granted;
    }

    public function getPermissionsForProgram(string $programSlug): array
    {
        $programId = SuiteProgram::where('slug', $programSlug)->value('id');

        return $this->permissions()
            ->where(
                fn($q) => $q
                    ->where('user_permissions.program_id', $programId)
                    ->orWhereNull('user_permissions.program_id')
            )
            ->wherePivot('granted', true)
            ->pluck('permissions.name')
            ->toArray();
    }

    // ── JWT ──────────────────────────────────────────────────

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'email' => $this->email,
            'name' => $this->name,
            'status' => $this->status,
            'position' => $this->position?->name,
        ];
    }
}
