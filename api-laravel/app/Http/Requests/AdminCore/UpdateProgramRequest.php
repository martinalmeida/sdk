<?php

namespace App\Http\Requests\AdminCore;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $programId = $this->route('program')?->id;
        return [
            'name' => "sometimes|string|max:100|unique:suite_programs,name,{$programId}",
            'slug' => "sometimes|string|max:100|unique:suite_programs,slug,{$programId}",
            'description' => 'nullable|string',
            'version' => 'sometimes|string|max:20',
            'is_active' => 'boolean',
        ];
    }
}
