<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Role extends Model
{
    protected $fillable = ['name', 'label', 'description', 'is_global', 'program_id'];

    protected function casts(): array
    {
        return ['is_global' => 'boolean'];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(SuiteProgram::class, 'program_id');
    }
}
