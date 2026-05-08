<?php
namespace App\Models\DataCore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChartTypeRule extends Model
{
    protected $table = 'dc_chart_type_rules';
    protected $fillable = ['chart_type_id', 'rule_key', 'rule_value', 'description'];
    protected $casts = [];

    public function chartType(): BelongsTo
    {
        return $this->belongsTo(ChartType::class, 'chart_type_id');
    }
}
