<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $groupId = $this->route('group')?->id;
        return [
            'name' => "sometimes|string|max:100|unique:groups,name,{$groupId}",
            'description' => 'nullable|string',
        ];
    }
}
