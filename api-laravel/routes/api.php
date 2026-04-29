<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn() => response()->json([
    'status' => 'ok',
    'timestamp' => now()->toDateTimeString(),
]));

Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:api', 'session.valid'])->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('logout-all', [AuthController::class, 'logoutAll']);
    Route::get('me', [AuthController::class, 'me']);

    // DataCore
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
