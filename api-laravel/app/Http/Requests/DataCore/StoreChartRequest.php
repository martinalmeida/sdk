<?php
namespace App\Http\Requests\DataCore;

use Illuminate\Foundation\Http\FormRequest;

class StoreChartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'program_id' => 'required|exists:suite_programs,id',
            'chart_type_id' => 'required|exists:dc_chart_types,id',
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'sql_query' => 'required|string',
            'x_axis_column' => 'nullable|string',
            'y_axis_column' => 'nullable|string',
            'series_column' => 'nullable|string',
            'label_column' => 'nullable|string',
            'style_config' => 'nullable|json',
            'extra_config' => 'nullable|json',
            'status' => 'in:draft,validated,published,deprecated',
            'is_public' => 'boolean',
        ];
    }
}
