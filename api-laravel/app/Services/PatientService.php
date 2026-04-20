<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class PatientService
{
    //Aceptamos el parámetro search opcional (nullable)
    public function getAllPatients(?string $search = null): LengthAwarePaginator
    {
        return Patient::with(['documentType', 'gender', 'department', 'municipality'])
            ->when($search, function (Builder $query, $search) {
                //Agrupamos las condiciones OR dentro de un paréntesis (WHERE (... OR ...))
                $query->where(function ($q) use ($search) {
                    $q->where('document_number', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      //Búsqueda por partes del nombre individualmente
                      ->orWhere('first_name', 'like', "%{$search}%")
                      ->orWhere('first_surname', 'like', "%{$search}%")
                      //Búsqueda avanzada: Concatenación para encontrar "Juan Perez"
                      ->orWhereRaw("CONCAT(first_name, ' ', IFNULL(second_name, ''), ' ', first_surname, ' ', IFNULL(second_surname, '')) LIKE ?", ["%{$search}%"]);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function createPatient(array $data): Patient
    {
        return Patient::create($data);
    }

    public function updatePatient(Patient $patient, array $data): Patient
    {
        $patient->update($data);
        return $patient->fresh(['documentType', 'gender', 'department', 'municipality']);
    }

    public function deletePatient(Patient $patient): void
    {
        $patient->delete();
    }
}