<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChartParameter extends Model
{
    protected $table = 'dc_chart_parameters';
    protected $fillable = [
        'chart_id', 'key', 'label', 'type', 'default_value', 'is_required'
    ];
    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function chart(): BelongsTo
    {
        return $this->belongsTo(Chart::class, 'chart_id');
    }
}
