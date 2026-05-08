<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardChart extends Model
{
    protected $table = 'dc_dashboard_charts';
    protected $fillable = [
        'dashboard_id',
        'chart_id',
        'position_x',
        'position_y',
        'width',
        'height',
        'sort_order',
        'override_config'
    ];
    protected $casts = [
        'override_config' => 'json',
    ];

    public function dashboard(): BelongsTo
    {
        return $this->belongsTo(Dashboard::class, 'dashboard_id');
    }

    public function chart(): BelongsTo
    {
        return $this->belongsTo(Chart::class, 'chart_id');
    }
}
