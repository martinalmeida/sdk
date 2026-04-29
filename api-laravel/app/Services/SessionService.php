<?php
namespace App\Services;

use App\Models\UserSession;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class SessionService
{
    public function create(int $userId, string $token, Request $request): UserSession
    {
        $payload = JWTAuth::setToken($token)->getPayload();

        return UserSession::create([
            'user_id' => $userId,
            'jti' => $payload->get('jti'),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'expires_at' => now()->addMinutes(config('jwt.ttl')),
            'is_active' => true,
        ]);
    }

    public function validate(string $token): bool
    {
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
            $session = UserSession::where('jti', $payload->get('jti'))->first();

            if (!$session || !$session->isValid())
                return false;

            $session->updateQuietly(['last_used_at' => now()]);

            return true;
        } catch (\Throwable) {
            return false;
        }
    }

    public function revoke(string $token): void
    {
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
            UserSession::where('jti', $payload->get('jti'))
                ->update(['is_active' => false]);
        } catch (\Throwable) {
        }
    }

    public function revokeAll(int $userId): void
    {
        UserSession::where('user_id', $userId)
            ->where('is_active', true)
            ->update(['is_active' => false]);
    }

    public function cleanExpired(): int
    {
        return UserSession::where('expires_at', '<', now())->delete();
    }
}
