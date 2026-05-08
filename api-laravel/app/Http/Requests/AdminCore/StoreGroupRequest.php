<?php

namespace App\Http\Requests\AdminCore;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:groups,name',
            'description' => 'nullable|string',
        ];
    }
}
