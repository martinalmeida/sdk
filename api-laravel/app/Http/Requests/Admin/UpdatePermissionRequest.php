<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission')?->id;
        return [
            'name' => "sometimes|string|max:100|unique:permissions,name,{$permissionId}",
            'label' => 'sometimes|string|max:100',
            'group' => 'sometimes|string|max:50',
            'program_id' => 'nullable|exists:suite_programs,id',
        ];
    }
}
