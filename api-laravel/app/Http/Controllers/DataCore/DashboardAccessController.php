<?php

namespace App\Http\Controllers\DataCore;

use App\Http\Controllers\Controller;
use App\Models\DataCore\Dashboard;
use App\Models\AdminCore\User;
use App\Models\AdminCore\Group;
use Illuminate\Http\Request;

class DashboardAccessController extends Controller
{
    public function grantUser(Request $request, Dashboard $dashboard, User $user)
    {
        $request->validate([
            'can_edit' => 'boolean',
            'can_share' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $dashboard->users()->syncWithoutDetaching([
            $user->id => [
                'can_edit' => $request->input('can_edit', false),
                'can_share' => $request->input('can_share', false),
                'expires_at' => $request->input('expires_at'),
                'granted_at' => now(),
            ]
        ]);

        return response()->json(['message' => 'Acceso concedido al usuario']);
    }

    public function revokeUser(Dashboard $dashboard, User $user)
    {
        $dashboard->users()->detach($user->id);
        return response()->json(['message' => 'Acceso revocado']);
    }

    public function grantGroup(Request $request, Dashboard $dashboard, Group $group)
    {
        $request->validate([
            'can_edit' => 'boolean',
            'can_share' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $dashboard->groups()->syncWithoutDetaching([
            $group->id => [
                'can_edit' => $request->input('can_edit', false),
                'can_share' => $request->input('can_share', false),
                'expires_at' => $request->input('expires_at'),
                'granted_at' => now(),
            ]
        ]);

        return response()->json(['message' => 'Acceso concedido al grupo']);
    }

    public function revokeGroup(Dashboard $dashboard, Group $group)
    {
        $dashboard->groups()->detach($group->id);
        return response()->json(['message' => 'Acceso revocado']);
    }

    public function getGlobalFilters(Dashboard $dashboard)
    {
        return response()->json($dashboard->filters);
    }
}
