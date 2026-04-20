<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patientId = $this->route('patient')->id;

        return [
            'document_type_id' => 'sometimes|integer|exists:document_types,id',
            'document_number' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('patients', 'document_number')->ignore($patientId)
            ],
            'first_name' => 'sometimes|string|max:100',
            'second_name' => 'nullable|string|max:100',
            'first_surname' => 'sometimes|string|max:100',
            'second_surname' => 'nullable|string|max:100',
            'gender_id' => 'sometimes|integer|exists:genders,id',
            'department_id' => 'sometimes|integer|exists:departments,id',
            'municipality_id' => 'sometimes|integer|exists:municipalities,id',
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('patients', 'email')->ignore($patientId)
            ],
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