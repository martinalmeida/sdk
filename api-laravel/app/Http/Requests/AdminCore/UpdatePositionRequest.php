<?php

namespace App\Http\Requests\AdminCore;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $positionId = $this->route('position')?->id;
        return [
            'name' => "sometimes|string|max:100|unique:positions,name,{$positionId}",
            'description' => 'nullable|string',
        ];
    }
}
