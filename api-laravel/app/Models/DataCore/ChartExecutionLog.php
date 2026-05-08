<?php

namespace App\Models\DataCore;

use App\Models\AdminCore\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChartExecutionLog extends Model
{
    protected $table = 'dc_chart_execution_logs';

    protected $fillable = [
        'chart_id',
        'user_id',
        'dashboard_id',
        'applied_filters',
        'execution_time_ms',
        'rows_returned',
        'status',
        'error_message',
        'executed_at',
    ];

    protected $casts = [
        'applied_filters' => 'array',
        'executed_at' => 'datetime',
    ];

    public function chart(): BelongsTo
    {
        return $this->belongsTo(Chart::class, 'chart_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dashboard(): BelongsTo
    {
        return $this->belongsTo(Dashboard::class, 'dashboard_id');
    }
}
