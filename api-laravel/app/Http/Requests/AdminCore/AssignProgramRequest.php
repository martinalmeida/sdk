<?php

namespace App\Http\Requests\AdminCore;

use Illuminate\Foundation\Http\FormRequest;

class AssignProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'program_id' => 'required|exists:suite_programs,id',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ];
    }
}
