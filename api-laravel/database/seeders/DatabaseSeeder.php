<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        //Crear Roles primero
        $adminRole = Role::create(['name' => 'Admin', 'description' => 'Administrador del sistema']);
        $viewRole = Role::create(['name' => 'Viewer', 'description' => 'Usuario con permisos de visualización']);

        //Crear Usuarios
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
            'role_id' => $adminRole->id,
        ]);

        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'viewer@test.com',
            'password' => 'password',
            'role_id' => $viewRole->id,
        ]);

        //Seeders para pacientes
        $this->call([
            DocumentTypeSeeder::class,
            GenderSeeder::class,
            DepartmentSeeder::class,
            MunicipalitySeeder::class,
        ]);
    }
}