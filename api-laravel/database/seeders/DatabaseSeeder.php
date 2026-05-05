<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Position;
use App\Models\Role;
use App\Models\SuiteProgram;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Programas
        $dataCore = SuiteProgram::create([
            'name' => 'DataCore',
            'slug' => 'data-core',
            'description' => 'Panel Estadístico',
            'version' => '0.1',
            'is_active' => true,
        ]);

        $adminCore = SuiteProgram::create([
            'name' => 'AdminCore',
            'slug' => 'admin-core',
            'description' => 'Administración de la suite',
            'version' => '0.1',
            'is_active' => true,
        ]);

        // 2. Cargos (positions)
        $contador = Position::create(['name' => 'Contador']);
        Position::create(['name' => 'Gerente']);
        Position::create(['name' => 'Auxiliar Contable']);
        Position::create(['name' => 'Administrador de Sistema']);

        // 3. Roles
        $superAdmin = Role::create([
            'name' => 'super_admin',
            'label' => 'Super Administrador',
            'is_global' => true,
            'program_id' => null,
        ]);

        // Roles DataCore
        $adminDataCore = Role::create([
            'name' => 'admin_data_core',
            'label' => 'Administrador DataCore',
            'is_global' => false,
            'program_id' => $dataCore->id,
        ]);
        $userDataCore = Role::create([
            'name' => 'user_data_core',
            'label' => 'Usuario DataCore',
            'is_global' => false,
            'program_id' => $dataCore->id,
        ]);

        // Roles AdminCore
        $superAdminCore = Role::create([
            'name' => 'super_admin_core',
            'label' => 'Super Administrador del Sistema',
            'is_global' => false,
            'program_id' => $adminCore->id,
        ]);
        $adminAdminCore = Role::create([
            'name' => 'admin_admin_core',
            'label' => 'Administrador de AdminCore',
            'is_global' => false,
            'program_id' => $adminCore->id,
        ]);

        // 4. Permisos DataCore
        $dataPerms = [
            ['name' => 'users.read', 'label' => 'Ver usuarios', 'group' => 'users'],
            ['name' => 'users.create', 'label' => 'Crear usuarios', 'group' => 'users'],
            ['name' => 'users.update', 'label' => 'Editar usuarios', 'group' => 'users'],
            ['name' => 'users.delete', 'label' => 'Eliminar usuarios', 'group' => 'users'],
            ['name' => 'reports.read', 'label' => 'Ver reportes', 'group' => 'reports'],
        ];
        foreach ($dataPerms as $perm) {
            Permission::create(array_merge($perm, ['program_id' => $dataCore->id]));
        }

        // 5. Permisos AdminCore
        $adminPerms = [
            ['name' => 'admin.users.read', 'label' => 'Listar usuarios', 'group' => 'users'],
            ['name' => 'admin.users.create', 'label' => 'Crear usuarios', 'group' => 'users'],
            ['name' => 'admin.users.update', 'label' => 'Editar usuarios', 'group' => 'users'],
            ['name' => 'admin.users.delete', 'label' => 'Eliminar usuarios', 'group' => 'users'],
            ['name' => 'admin.groups.read', 'label' => 'Ver grupos', 'group' => 'groups'],
            ['name' => 'admin.groups.create', 'label' => 'Crear grupos', 'group' => 'groups'],
            ['name' => 'admin.groups.update', 'label' => 'Editar grupos', 'group' => 'groups'],
            ['name' => 'admin.groups.delete', 'label' => 'Eliminar grupos', 'group' => 'groups'],
            ['name' => 'admin.roles.read', 'label' => 'Listar roles', 'group' => 'roles'],
            ['name' => 'admin.roles.create', 'label' => 'Crear roles', 'group' => 'roles'],
            ['name' => 'admin.roles.update', 'label' => 'Editar roles', 'group' => 'roles'],
            ['name' => 'admin.roles.delete', 'label' => 'Eliminar roles', 'group' => 'roles'],
            ['name' => 'admin.permissions.read', 'label' => 'Listar permisos', 'group' => 'permissions'],
            ['name' => 'admin.permissions.assign', 'label' => 'Asignar permisos', 'group' => 'permissions'],
            ['name' => 'admin.permissions.create', 'label' => 'Crear permisos', 'group' => 'permissions'],
            ['name' => 'admin.permissions.update', 'label' => 'Editar permisos', 'group' => 'permissions'],
            ['name' => 'admin.permissions.delete', 'label' => 'Eliminar permisos', 'group' => 'permissions'],
            ['name' => 'admin.programs.read', 'label' => 'Ver programas', 'group' => 'programs'],
            ['name' => 'admin.programs.create', 'label' => 'Crear programas', 'group' => 'programs'],
            ['name' => 'admin.programs.update', 'label' => 'Editar programas', 'group' => 'programs'],
            ['name' => 'admin.programs.delete', 'label' => 'Eliminar programas', 'group' => 'programs'],
            ['name' => 'admin.positions.read', 'label' => 'Ver cargos', 'group' => 'positions'],
            ['name' => 'admin.positions.create', 'label' => 'Crear cargos', 'group' => 'positions'],
            ['name' => 'admin.positions.update', 'label' => 'Editar cargos', 'group' => 'positions'],
            ['name' => 'admin.positions.delete', 'label' => 'Eliminar cargos', 'group' => 'positions'],
        ];
        foreach ($adminPerms as $perm) {
            Permission::create(array_merge($perm, ['program_id' => $adminCore->id]));
        }

        // 6. Usuarios y asignaciones

        // Super Admin (global, tiene acceso a todo)
        $superUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);
        $superUser->programs()->attach($dataCore->id, [
            'role_id' => $superAdmin->id,
            'is_active' => true,
            'granted_at' => now(),
        ]);
        $superUser->programs()->attach($adminCore->id, [
            'role_id' => $superAdmin->id,
            'is_active' => true,
            'granted_at' => now(),
        ]);

        // Administrador de DataCore (maria@suite.com)
        $adminUser = User::create([
            'name' => 'María Admin',
            'email' => 'maria@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);
        $adminUser->programs()->attach($dataCore->id, [
            'role_id' => $adminDataCore->id,
            'is_active' => true,
            'granted_at' => now(),
        ]);

        // Asignar permisos individuales a maria (DataCore)
        $permNamesData = ['users.read', 'users.create', 'users.update', 'users.delete', 'reports.read'];
        $permIdsData = Permission::whereIn('name', $permNamesData)
            ->where('program_id', $dataCore->id)
            ->pluck('id');
        foreach ($permIdsData as $permId) {
            $adminUser->permissions()->syncWithoutDetaching([
                $permId => ['program_id' => $dataCore->id, 'granted' => true],
            ]);
        }

        // Administrador de AdminCore (carlos@suite.com)
        $adminAdmin = User::create([
            'name' => 'Carlos Admin',
            'email' => 'carlos@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);
        $adminAdmin->programs()->attach($adminCore->id, [
            'role_id' => $adminAdminCore->id,
            'is_active' => true,
            'granted_at' => now(),
        ]);

        // Asignar todos los permisos de AdminCore a carlos
        $permIdsAdmin = Permission::where('program_id', $adminCore->id)->pluck('id');
        foreach ($permIdsAdmin as $permId) {
            $adminAdmin->permissions()->syncWithoutDetaching([
                $permId => ['program_id' => $adminCore->id, 'granted' => true],
            ]);
        }

        // Usuario normal DataCore (juan@suite.com)
        $normalUser = User::create([
            'name' => 'Juan Díaz',
            'email' => 'juan@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);
        $normalUser->programs()->attach($dataCore->id, [
            'role_id' => $userDataCore->id,
            'is_active' => true,
            'granted_at' => now(),
        ]);

        // Asignar permisos limitados a juan
        $permNamesNormal = ['users.read', 'reports.read'];
        $permIdsNormal = Permission::whereIn('name', $permNamesNormal)
            ->where('program_id', $dataCore->id)
            ->pluck('id');
        foreach ($permIdsNormal as $permId) {
            $normalUser->permissions()->syncWithoutDetaching([
                $permId => ['program_id' => $dataCore->id, 'granted' => true],
            ]);
        }
    }
}
