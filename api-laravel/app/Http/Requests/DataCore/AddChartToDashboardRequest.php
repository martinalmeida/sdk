<?php

namespace App\Http\Requests\DataCore;

use Illuminate\Foundation\Http\FormRequest;

class AddChartToDashboardRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'chart_id' => 'required|exists:dc_charts,id',
            'position_x' => 'integer|min:0',
            'position_y' => 'integer|min:0',
            'width' => 'integer|min:1|max:12',
            'height' => 'integer|min:1',
            'override_config' => 'nullable|array',
        ];
    }
}
