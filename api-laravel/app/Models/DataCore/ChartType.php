<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChartType extends Model
{
    protected $table = 'dc_chart_types';
    protected $fillable = [
        'name',
        'label',
        'description',
        'icon',
        'supports_multiple_series',
        'requires_category_axis',
        'requires_value_axis',
        'is_active'
    ];
    protected $casts = [
        'supports_multiple_series' => 'boolean',
        'requires_category_axis' => 'boolean',
        'requires_value_axis' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function rules(): HasMany
    {
        return $this->hasMany(ChartTypeRule::class, 'chart_type_id');
    }

    public function filters(): HasMany
    {
        return $this->hasMany(ChartTypeFilter::class, 'chart_type_id');
    }

    public function charts(): HasMany
    {
        return $this->hasMany(Chart::class, 'chart_type_id');
    }
}
