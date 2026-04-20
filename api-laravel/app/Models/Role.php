<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    /**
     * Relación: Un Rol tiene muchos Usuarios.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}