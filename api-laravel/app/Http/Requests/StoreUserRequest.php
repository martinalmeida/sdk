<?php

namespace App\Http\Requests;

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
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8',
            'role_id' => 'required|integer|exists:roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'role_id.exists' => 'El rol seleccionado no es válido en nuestra base de datos.',
        ];
    }
}