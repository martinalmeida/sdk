<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AdminCore\UserController;
use App\Http\Controllers\AdminCore\GroupController;
use App\Http\Controllers\AdminCore\RoleController;
use App\Http\Controllers\AdminCore\ProgramController;
use App\Http\Controllers\AdminCore\PositionController;
use App\Http\Controllers\DataCore\ChartTypeController;
use App\Http\Controllers\DataCore\ChartController;
use App\Http\Controllers\DataCore\ChartExecutionController;
use App\Http\Controllers\DataCore\DashboardController;
use App\Http\Controllers\DataCore\DashboardAccessController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn() => response()->json(['status' => 'ok']));

Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:api', 'session.valid'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('logout-all', [AuthController::class, 'logoutAll']);
    Route::get('me', [AuthController::class, 'me']);

    //==================== AdminCore ====================
    Route::middleware('program.access:admin-core')
        ->prefix('admin-core')
        ->group(function () {
            //Usuarios
            Route::middleware('role:admin_admin_core,admin-core')
                ->get('users', [UserController::class, 'index']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->post('users', [UserController::class, 'store']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->get('users/{user}', [UserController::class, 'show']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->put('users/{user}', [UserController::class, 'update']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->delete('users/{user}', [UserController::class, 'destroy']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->post('users/{user}/assign-program', [UserController::class, 'assignProgram']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->delete('users/{user}/remove-program/{programId}', [UserController::class, 'removeProgram']);

            //Grupos
            Route::middleware('role:admin_admin_core,admin-core')
                ->apiResource('groups', GroupController::class)->except(['create', 'edit']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->post('groups/{group}/assign-users', [GroupController::class, 'assignUsers']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->delete('groups/{group}/remove-users', [GroupController::class, 'removeUsers']);

            //Roles
            Route::middleware('role:admin_admin_core,admin-core')
                ->get('roles', [RoleController::class, 'index']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->post('roles', [RoleController::class, 'store']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->get('roles/{role}', [RoleController::class, 'show']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->put('roles/{role}', [RoleController::class, 'update']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->delete('roles/{role}', [RoleController::class, 'destroy']);

            //Programas
            Route::middleware('role:admin_admin_core,admin-core')
                ->get('programs', [ProgramController::class, 'index']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->post('programs', [ProgramController::class, 'store']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->get('programs/{program}', [ProgramController::class, 'show']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->put('programs/{program}', [ProgramController::class, 'update']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->delete('programs/{program}', [ProgramController::class, 'destroy']);

            //Cargos
            Route::middleware('role:admin_admin_core,admin-core')
                ->get('positions', [PositionController::class, 'index']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->post('positions', [PositionController::class, 'store']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->get('positions/{position}', [PositionController::class, 'show']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->put('positions/{position}', [PositionController::class, 'update']);

            Route::middleware('role:admin_admin_core,admin-core')
                ->delete('positions/{position}', [PositionController::class, 'destroy']);
        });

    //==================== DataCore ====================
    Route::middleware('program.access:data-core')
        ->prefix('data-core')
        ->group(function () {

            // Todas las rutas de escritura requieren rol administrador
            Route::middleware('role:admin_data_core,data-core')->group(function () {
                // Gráficas
                Route::apiResource('charts', ChartController::class);
                Route::post('charts/validate-sql', [ChartExecutionController::class, 'validateSql']);
                Route::post('charts/{chart}/validate-sql', [ChartExecutionController::class, 'validateSql']);
                Route::post('charts/{chart}/execute', [ChartExecutionController::class, 'execute']);

                // Tableros
                Route::apiResource('dashboards', DashboardController::class);
                Route::post('dashboards/{dashboard}/charts', [DashboardController::class, 'addChart']);
                Route::delete('dashboards/{dashboard}/charts/{dashboardChart}', [DashboardController::class, 'removeChart']);
                Route::put('dashboards/{dashboard}/charts/{dashboardChart}', [DashboardController::class, 'updateChartPosition']);

                // Asignaciones de acceso (solo administradores)
                Route::post('dashboards/{dashboard}/users/{user}', [DashboardAccessController::class, 'grantUser']);
                Route::delete('dashboards/{dashboard}/users/{user}', [DashboardAccessController::class, 'revokeUser']);
                Route::post('dashboards/{dashboard}/groups/{group}', [DashboardAccessController::class, 'grantGroup']);
                Route::delete('dashboards/{dashboard}/groups/{group}', [DashboardAccessController::class, 'revokeGroup']);
            });

            // Catálogo de tipos de gráfico (público)
            Route::get('chart-types', [ChartTypeController::class, 'index']);

            Route::middleware('role:admin_data_core,data-core')->get('execution-logs', [ChartExecutionController::class, 'logs']);
        });
});
