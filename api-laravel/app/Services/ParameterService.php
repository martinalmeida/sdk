<?php

namespace App\Services;

use App\Models\DocumentType;
use App\Models\Gender;
use App\Models\Department;
use App\Models\Municipality;
use Illuminate\Database\Eloquent\Collection;

class ParameterService
{
    public function getDocumentTypes(): Collection
    {
        return DocumentType::all();
    }

    public function getGenders(): Collection
    {
        return Gender::all();
    }

    public function getDepartments(): Collection
    {
        return Department::all();
    }

    public function getMunicipalities(?int $departmentId = null): Collection
    {
        return Municipality::when($departmentId, function ($query) use ($departmentId) {
            return $query->where('department_id', $departmentId);
        })->get();
    }
}