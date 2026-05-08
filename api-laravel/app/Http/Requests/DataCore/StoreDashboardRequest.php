<?php

namespace App\Http\Requests\DataCore;

use Illuminate\Foundation\Http\FormRequest;

class StoreDashboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // la autorización se maneja más adelante con policies o roles
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'layout_config' => 'nullable|array',
            'is_public' => 'boolean',
            'status' => 'in:draft,published,archived',
        ];
    }
}
