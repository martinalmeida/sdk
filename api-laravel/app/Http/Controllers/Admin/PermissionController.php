<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Permission::with('program');
        if ($request->has('program_id')) {
            $query->where('program_id', $request->program_id);
        }
        $permissions = $query->get();
        return response()->json($permissions);
    }
}
