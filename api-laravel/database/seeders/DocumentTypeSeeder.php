<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $documentTypes = [
            ['code' => 'CC', 'name' => 'Cédula de Ciudadanía'],
            ['code' => 'TI', 'name' => 'Tarjeta de Identidad'],
            ['code' => 'CE', 'name' => 'Cédula de Extranjería'],
            ['code' => 'PA', 'name' => 'Pasaporte'],
            ['code' => 'RC', 'name' => 'Registro Civil'],
            ['code' => 'MS', 'name' => 'Menor Sin Identificación'],
            ['code' => 'AS', 'name' => 'Adulto Sin Identificación'],
        ];

        foreach ($documentTypes as $type) {
            DocumentType::create($type);
        }
    }
}