<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación: Un Usuario pertenece a un Rol.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Identificador para el token JWT (usualmente el ID).
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Claims personalizados para el payload del token.
     * Agregamos el rol y el email dentro del token encriptado.
     */
    public function getJWTCustomClaims()
    {
        return [
            'email' => $this->email,
            'role' => $this->role->name ?? 'invitado',
        ];
    }
}