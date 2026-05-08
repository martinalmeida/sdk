<?php

namespace App\Http\Requests\AdminCore;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'position_id' => 'nullable|exists:positions,id',
            'status' => 'in:active,inactive,suspended',
        ];
    }
}
