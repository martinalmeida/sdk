<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardFilter extends Model
{
    protected $table = 'dc_dashboard_filters';
    protected $fillable = [
        'dashboard_id',
        'chart_type_filter_id',
        'default_value',
        'is_visible',
        'sort_order'
    ];
    protected $casts = [
        'is_visible' => 'boolean',
    ];

    public function dashboard(): BelongsTo
    {
        return $this->belongsTo(Dashboard::class, 'dashboard_id');
    }

    public function chartTypeFilter(): BelongsTo
    {
        return $this->belongsTo(ChartTypeFilter::class, 'chart_type_filter_id');
    }
}
