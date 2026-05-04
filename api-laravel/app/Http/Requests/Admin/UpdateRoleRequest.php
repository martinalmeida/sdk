<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('role')?->id;
        return [
            'name' => "sometimes|string|max:50|unique:roles,name,{$roleId}",
            'label' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'is_global' => 'boolean',
            'program_id' => 'nullable|exists:suite_programs,id',
        ];
    }
}
