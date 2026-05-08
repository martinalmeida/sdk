<?php

namespace App\Models\AdminCore;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Auth\UserSession;
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

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_user')->withTimestamps();
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(UserSession::class);
    }

    //Helpers de acceso
    public function canAccessProgram(string $programSlug): bool
    {
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

        if (!$program) {
            return null;
        }

        return Role::find($program->pivot->role_id);
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
