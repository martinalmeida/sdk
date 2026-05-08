<?php

namespace App\Http\Requests\DataCore;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDashboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'layout_config' => 'nullable|array',
            'is_public' => 'boolean',
            'status' => 'in:draft,published,archived',
        ];
    }
}
