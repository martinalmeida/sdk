<?php
namespace App\Models\DataCore;

use App\Models\AdminCore\SuiteProgram;
use App\Models\AdminCore\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chart extends Model
{
    use SoftDeletes;
    protected $table = 'dc_charts';
    protected $fillable = [
        'program_id',
        'chart_type_id',
        'created_by',
        'name',
        'description',
        'sql_query',
        'x_axis_column',
        'y_axis_column',
        'series_column',
        'label_column',
        'style_config',
        'extra_config',
        'status',
        'is_public'
    ];
    protected $casts = [
        'style_config' => 'json',
        'extra_config' => 'json',
        'is_public' => 'boolean',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(SuiteProgram::class, 'program_id');
    }

    public function chartType(): BelongsTo
    {
        return $this->belongsTo(ChartType::class, 'chart_type_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function chartFilters(): HasMany
    {
        return $this->hasMany(ChartFilter::class, 'chart_id');
    }

    public function parameters(): HasMany
    {
        return $this->hasMany(ChartParameter::class, 'chart_id');
    }

    public function dashboardCharts(): HasMany
    {
        return $this->hasMany(DashboardChart::class, 'chart_id');
    }

    public function executionLogs(): HasMany
    {
        return $this->hasMany(ChartExecutionLog::class, 'chart_id');
    }
}
