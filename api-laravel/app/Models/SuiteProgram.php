<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SuiteProgram extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'version', 'is_active'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_programs',
            'program_id',  //FK del modelo actual (SuiteProgram)
            'user_id'      //FK del modelo relacionado (User)
        )
            ->withPivot(['role_id', 'is_active', 'granted_at'])
            ->withTimestamps();
    }

    public function roles(): HasMany
    {
        return $this->hasMany(Role::class, 'program_id');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class, 'program_id');
    }
}
