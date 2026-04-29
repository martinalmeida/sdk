<?php
use App\Services\SessionService;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    $deleted = app(SessionService::class)->cleanExpired();
    logger("Sesiones expiradas eliminadas: {$deleted}");
})->daily()->name('clean-expired-sessions');
