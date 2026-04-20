<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['code' => '05', 'name' => 'Antioquia'],
            ['code' => '08', 'name' => 'Atlántico'],
            ['code' => '11', 'name' => 'Bogotá D.C.'],
            ['code' => '13', 'name' => 'Bolívar'],
            ['code' => '15', 'name' => 'Boyacá'],
            ['code' => '17', 'name' => 'Caldas'],
            ['code' => '18', 'name' => 'Caquetá'],
            ['code' => '19', 'name' => 'Cauca'],
            ['code' => '20', 'name' => 'Cesar'],
            ['code' => '23', 'name' => 'Córdoba'],
            ['code' => '25', 'name' => 'Cundinamarca'],
            ['code' => '27', 'name' => 'Chocó'],
            ['code' => '41', 'name' => 'Huila'],
            ['code' => '44', 'name' => 'La Guajira'],
            ['code' => '47', 'name' => 'Magdalena'],
            ['code' => '50', 'name' => 'Meta'],
            ['code' => '52', 'name' => 'Nariño'],
            ['code' => '54', 'name' => 'Norte de Santander'],
            ['code' => '63', 'name' => 'Quindío'],
            ['code' => '66', 'name' => 'Risaralda'],
            ['code' => '68', 'name' => 'Santander'],
            ['code' => '70', 'name' => 'Sucre'],
            ['code' => '73', 'name' => 'Tolima'],
            ['code' => '76', 'name' => 'Valle del Cauca'],
            ['code' => '81', 'name' => 'Arauca'],
            ['code' => '85', 'name' => 'Casanare'],
            ['code' => '86', 'name' => 'Putumayo'],
            ['code' => '88', 'name' => 'Archipiélago de San Andrés'],
            ['code' => '91', 'name' => 'Amazonas'],
            ['code' => '94', 'name' => 'Guainía'],
            ['code' => '95', 'name' => 'Guaviare'],
            ['code' => '97', 'name' => 'Vaupés'],
            ['code' => '99', 'name' => 'Vichada'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}