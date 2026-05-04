<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Admin\AdminUserService;
use App\Services\DataCore\UserService;
use App\Services\Auth\SessionService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AdminUserService::class, fn() => new AdminUserService());
        $this->app->bind(UserService::class, fn() => new UserService());
        $this->app->bind(SessionService::class, fn() => new SessionService());
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
