<?php

namespace App\Models\DataCore;

use App\Models\AdminCore\SuiteProgram;
use App\Models\AdminCore\User;
use App\Models\AdminCore\Group;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dashboard extends Model
{
    use SoftDeletes;
    protected $table = 'dc_dashboards';
    protected $fillable = [
        'program_id',
        'created_by',
        'name',
        'description',
        'layout_config',
        'status',
        'is_public'
    ];
    protected $casts = [
        'layout_config' => 'json',
        'is_public' => 'boolean',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(SuiteProgram::class, 'program_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function dashboardCharts(): HasMany
    {
        return $this->hasMany(DashboardChart::class, 'dashboard_id');
    }

    public function dashboardFilters(): HasMany
    {
        return $this->hasMany(DashboardFilter::class, 'dashboard_id');
    }

    public function executionLogs(): HasMany
    {
        return $this->hasMany(ChartExecutionLog::class, 'dashboard_id');
    }

    public function charts(): HasMany
    {
        return $this->dashboardCharts();
    }
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'dc_dashboard_users')
            ->withPivot('can_edit', 'can_share', 'expires_at', 'granted_at')
            ->withTimestamps();
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'dc_dashboard_groups', 'dashboard_id', 'group_id')
            ->withPivot('can_edit', 'can_share', 'granted_at', 'expires_at')
            ->withTimestamps();
    }
}
