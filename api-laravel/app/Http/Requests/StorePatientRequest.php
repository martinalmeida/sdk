<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_type_id' => 'required|integer|exists:document_types,id',
            'document_number' => 'required|string|max:20|unique:patients,document_number',
            'first_name' => 'required|string|max:100',
            'second_name' => 'nullable|string|max:100',
            'first_surname' => 'required|string|max:100',
            'second_surname' => 'nullable|string|max:100',
            'gender_id' => 'required|integer|exists:genders,id',
            'department_id' => 'required|integer|exists:departments,id',
            'municipality_id' => 'required|integer|exists:municipalities,id',
            'email' => 'required|email|unique:patients,email|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'document_type_id.exists' => 'El tipo de documento seleccionado no es válido.',
            'document_number.unique' => 'El número de documento ya está registrado.',
            'gender_id.exists' => 'El género seleccionado no es válido.',
            'department_id.exists' => 'El departamento seleccionado no es válido.',
            'municipality_id.exists' => 'El municipio seleccionado no es válido.',
            'email.unique' => 'El correo electrónico ya está registrado.',
        ];
    }
}