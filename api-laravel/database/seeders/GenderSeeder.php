<?php

namespace Database\Seeders;

use App\Models\Gender;
use Illuminate\Database\Seeder;

class GenderSeeder extends Seeder
{
    public function run(): void
    {
        $genders = [
            ['code' => 'M', 'name' => 'Masculino'],
            ['code' => 'F', 'name' => 'Femenino'],
            ['code' => 'O', 'name' => 'Otro'],
        ];

        foreach ($genders as $gender) {
            Gender::create($gender);
        }
    }
}