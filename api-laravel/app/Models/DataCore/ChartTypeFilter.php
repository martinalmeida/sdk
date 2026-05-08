<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChartTypeFilter extends Model
{
    protected $table = 'dc_chart_type_filters';
    protected $fillable = [
        'chart_type_id',
        'name',
        'label',
        'input_type',
        'sql_placeholder',
        'sql_injection_mode',
        'is_required',
        'default_value',
        'options'
    ];
    protected $casts = [
        'is_required' => 'boolean',
        'options' => 'json',
    ];

    public function chartType(): BelongsTo
    {
        return $this->belongsTo(ChartType::class, 'chart_type_id');
    }

    public function chartFilters(): HasMany
    {
        return $this->hasMany(ChartFilter::class, 'chart_type_filter_id');
    }

    public function dashboardFilters(): HasMany
    {
        return $this->hasMany(DashboardFilter::class, 'chart_type_filter_id');
    }
}
