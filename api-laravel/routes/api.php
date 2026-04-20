<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ParameterController;
use Illuminate\Support\Facades\Route;

//Ruta de Health Check
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toDateTimeString(),
        'database' => 'connected'
    ]);
});

//Rutas de autenticación (Públicas)
Route::post('login', [AuthController::class, 'login']);

//Rutas protegidas
Route::middleware('auth:api')->group(function () {
    //Logout
    Route::post('logout', [AuthController::class, 'logout']);

    //CRUD de Usuarios
    Route::apiResource('users', UserController::class);
    
    //CRUD de Pacientes
    Route::apiResource('patients', PatientController::class);

    //Rutas de Parámetros (Catálogos)
    Route::get('document-types', [ParameterController::class, 'getDocumentTypes']);
    Route::get('genders', [ParameterController::class, 'getGenders']);
    Route::get('departments', [ParameterController::class, 'getDepartments']);
    Route::get('municipalities', [ParameterController::class, 'getMunicipalities']);
});