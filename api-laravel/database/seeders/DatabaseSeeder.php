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
        //Programas
        $dataCore = SuiteProgram::create([
            'name' => 'DataCore',
            'slug' => 'data-core',
            'description' => 'Panel Estadístico',
            'version' => '0.1',
            'is_active' => true,
        ]);

        //Cargos
        $contador = Position::create(['name' => 'Contador']);
        Position::create(['name' => 'Gerente']);
        Position::create(['name' => 'Auxiliar Contable']);
        Position::create(['name' => 'Administrador de Sistema']);

        //Roles
        $superAdmin = Role::create([
            'name' => 'super_admin',
            'label' => 'Super Administrador',
            'is_global' => true,
            'program_id' => null,
        ]);

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

        //Permisos de DataCore
        $permUsersRead = Permission::create(['name' => 'users.read', 'label' => 'Ver usuarios', 'group' => 'users', 'program_id' => $dataCore->id]);
        $permUsersCreate = Permission::create(['name' => 'users.create', 'label' => 'Crear usuarios', 'group' => 'users', 'program_id' => $dataCore->id]);
        $permUsersUpdate = Permission::create(['name' => 'users.update', 'label' => 'Editar usuarios', 'group' => 'users', 'program_id' => $dataCore->id]);
        $permUsersDelete = Permission::create(['name' => 'users.delete', 'label' => 'Eliminar usuarios', 'group' => 'users', 'program_id' => $dataCore->id]);
        $permReportsRead = Permission::create(['name' => 'reports.read', 'label' => 'Ver reportes', 'group' => 'reports', 'program_id' => $dataCore->id]);

        //Super Admin
        $superUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);

        $superUser->programs()->attach((int) $dataCore->id, [
            'role_id' => (int) $superAdmin->id,
            'is_active' => true,
            'granted_at' => now()->toDateTimeString(),
        ]);

        //Admin DataCore
        $adminUser = User::create([
            'name' => 'María Admin',
            'email' => 'maria@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);

        $adminUser->programs()->attach((int) $dataCore->id, [
            'role_id' => (int) $adminDataCore->id,
            'is_active' => true,
            'granted_at' => now()->toDateTimeString(),
        ]);

        //Permisos individuales del admin — uno por uno sin collect
        $adminUser->permissions()->attach((int) $permUsersRead->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);
        $adminUser->permissions()->attach((int) $permUsersCreate->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);
        $adminUser->permissions()->attach((int) $permUsersUpdate->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);
        $adminUser->permissions()->attach((int) $permUsersDelete->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);
        $adminUser->permissions()->attach((int) $permReportsRead->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);

        //Usuario Normal
        $normalUser = User::create([
            'name' => 'Juan Díaz',
            'email' => 'juan@suite.com',
            'password' => bcrypt('password'),
            'position_id' => $contador->id,
            'status' => 'active',
        ]);

        $normalUser->programs()->attach((int) $dataCore->id, [
            'role_id' => (int) $userDataCore->id,
            'is_active' => true,
            'granted_at' => now()->toDateTimeString(),
        ]);

        $normalUser->permissions()->attach((int) $permUsersRead->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);
        $normalUser->permissions()->attach((int) $permReportsRead->id, ['program_id' => (int) $dataCore->id, 'granted' => true]);
    }
}
