<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:permissions,name',
            'label' => 'required|string|max:100',
            'group' => 'required|string|max:50',
            'program_id' => 'nullable|exists:suite_programs,id',
        ];
    }
}
