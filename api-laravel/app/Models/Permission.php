<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Permission extends Model
{
    protected $fillable = ['name', 'label', 'group', 'program_id'];

    public function program(): BelongsTo
    {
        return $this->belongsTo(SuiteProgram::class, 'program_id');
    }
}
