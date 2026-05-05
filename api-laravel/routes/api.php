<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DataCore\UserController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\GroupController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\PositionController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn() => response()->json(['status' => 'ok']));

Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:api', 'session.valid'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('logout-all', [AuthController::class, 'logoutAll']);
    Route::get('me', [AuthController::class, 'me']);

    // ==================== AdminCore ====================
    Route::middleware('program.access:admin-core')
        ->prefix('admin-core')
        ->group(function () {
            // Usuarios (gestión multi-programa)
            Route::middleware('permission:admin.users.read,admin-core')
                ->get('users', [AdminUserController::class, 'index']);

            Route::middleware('permission:admin.users.create,admin-core')
                ->post('users', [AdminUserController::class, 'store']);

            Route::middleware('permission:admin.users.read,admin-core')
                ->get('users/{user}', [AdminUserController::class, 'show']);

            Route::middleware('permission:admin.users.update,admin-core')
                ->put('users/{user}', [AdminUserController::class, 'update']);

            Route::middleware('permission:admin.users.delete,admin-core')
                ->delete('users/{user}', [AdminUserController::class, 'destroy']);

            // Asignación de programas y roles a usuarios
            Route::middleware('permission:admin.users.update,admin-core')
                ->post('users/{user}/assign-program', [AdminUserController::class, 'assignProgram']);

            Route::middleware('permission:admin.users.update,admin-core')
                ->delete('users/{user}/remove-program/{programId}', [AdminUserController::class, 'removeProgram']);

            // Grupos (roles globales)
            Route::middleware('permission:admin.groups.read,admin-core')
                ->apiResource('groups', GroupController::class)->except(['create', 'edit']);

            Route::middleware('permission:admin.groups.update,admin-core')
                ->post('groups/{group}/assign-users', [GroupController::class, 'assignUsers']);

            Route::middleware('permission:admin.groups.update,admin-core')
                ->delete('groups/{group}/remove-users', [GroupController::class, 'removeUsers']);

            // Roles (por programa)
            Route::middleware('permission:admin.roles.read,admin-core')
                ->get('roles', [RoleController::class, 'index']);

            Route::middleware('permission:admin.roles.create,admin-core')
                ->post('roles', [RoleController::class, 'store']);

            Route::middleware('permission:admin.roles.read,admin-core')
                ->get('roles/{role}', [RoleController::class, 'show']);

            Route::middleware('permission:admin.roles.update,admin-core')
                ->put('roles/{role}', [RoleController::class, 'update']);

            Route::middleware('permission:admin.roles.delete,admin-core')
                ->delete('roles/{role}', [RoleController::class, 'destroy']);

            // Permisos (listado y asignación)
            Route::middleware('permission:admin.permissions.read,admin-core')
                ->get('permissions', [PermissionController::class, 'index']);

            Route::middleware('permission:admin.permissions.assign,admin-core')
                ->post('users/{user}/grant-permission', [AdminUserController::class, 'grantPermission']);

            Route::middleware('permission:admin.permissions.assign,admin-core')
                ->delete('users/{user}/revoke-permission', [AdminUserController::class, 'revokePermission']);
                
            Route::middleware('permission:admin.permissions.create,admin-core')
                ->post('permissions', [PermissionController::class, 'store']);

            Route::middleware('permission:admin.permissions.update,admin-core')
                ->put('permissions/{permission}', [PermissionController::class, 'update']);

            Route::middleware('permission:admin.permissions.delete,admin-core')
                ->delete('permissions/{permission}', [PermissionController::class, 'destroy']);

            // Programas de la suite
            Route::middleware('permission:admin.programs.read,admin-core')
                ->get('programs', [ProgramController::class, 'index']);

            Route::middleware('permission:admin.programs.create,admin-core')
                ->post('programs', [ProgramController::class, 'store']);

            Route::middleware('permission:admin.programs.read,admin-core')
                ->get('programs/{program}', [ProgramController::class, 'show']);

            Route::middleware('permission:admin.programs.update,admin-core')
                ->put('programs/{program}', [ProgramController::class, 'update']);

            Route::middleware('permission:admin.programs.delete,admin-core')
                ->delete('programs/{program}', [ProgramController::class, 'destroy']);

            // Cargos (positions)
            Route::middleware('permission:admin.positions.read,admin-core')
                ->get('positions', [PositionController::class, 'index']);

            Route::middleware('permission:admin.positions.create,admin-core')
                ->post('positions', [PositionController::class, 'store']);

            Route::middleware('permission:admin.positions.read,admin-core')
                ->get('positions/{position}', [PositionController::class, 'show']);

            Route::middleware('permission:admin.positions.update,admin-core')
                ->put('positions/{position}', [PositionController::class, 'update']);

            Route::middleware('permission:admin.positions.delete,admin-core')
                ->delete('positions/{position}', [PositionController::class, 'destroy']);
        });

    // ==================== DataCore ====================
    Route::middleware('program.access:data-core')
        ->prefix('data-core')
        ->group(function () {
            Route::middleware('permission:users.read,data-core')
                ->get('users', [UserController::class, 'index']);

            Route::middleware('permission:users.create,data-core')
                ->post('users', [UserController::class, 'store']);

            Route::middleware('permission:users.read,data-core')
                ->get('users/{user}', [UserController::class, 'show']);

            Route::middleware('permission:users.update,data-core')
                ->put('users/{user}', [UserController::class, 'update']);

            Route::middleware('permission:users.delete,data-core')
                ->delete('users/{user}', [UserController::class, 'destroy']);

            Route::middleware('permission:users.update,data-core')
                ->post('users/{user}/grant-permission', [UserController::class, 'grantPermission']);

            Route::middleware('permission:users.update,data-core')
                ->delete('users/{user}/revoke-permission', [UserController::class, 'revokePermission']);
        });
});
