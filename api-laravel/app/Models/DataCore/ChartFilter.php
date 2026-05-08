<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChartFilter extends Model
{
    protected $table = 'dc_chart_filters';
    protected $fillable = [
        'chart_id',
        'chart_type_filter_id',
        'default_value',
        'is_visible',
        'is_required',
        'sort_order'
    ];
    protected $casts = [
        'is_visible' => 'boolean',
        'is_required' => 'boolean',
    ];

    public function chart(): BelongsTo
    {
        return $this->belongsTo(Chart::class, 'chart_id');
    }

    public function chartTypeFilter(): BelongsTo
    {
        return $this->belongsTo(ChartTypeFilter::class, 'chart_type_filter_id');
    }
}
