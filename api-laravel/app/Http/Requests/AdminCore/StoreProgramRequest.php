<?php

namespace App\Http\Requests\AdminCore;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:suite_programs,name',
            'slug' => 'required|string|max:100|unique:suite_programs,slug',
            'description' => 'nullable|string',
            'version' => 'sometimes|string|max:20',
            'is_active' => 'boolean',
        ];
    }
}
