<?php

namespace App\Services\DataCore;

use App\Models\DataCore\Dashboard;
use App\Models\DataCore\DashboardChart;
use App\Models\AdminCore\User;
use App\Models\AdminCore\SuiteProgram;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DashboardService
{
    /**
     * Obtener tableros a los que el usuario tiene acceso (públicos o asignados)
     */
    public function getAccessibleDashboards(User $user, string $programSlug)
    {
        return Dashboard::where('program_id', function ($query) use ($programSlug) {
            $query->select('id')->from('suite_programs')->where('slug', $programSlug);
        })
            ->where(function ($q) use ($user) {
                $q->where('is_public', true)
                    ->orWhereHas('users', function ($uq) use ($user) {
                        $uq->where('user_id', $user->id);
                    })
                    ->orWhereHas('groups', function ($gq) use ($user) {
                        $gq->whereIn('group_id', $user->groups()->pluck('groups.id'));
                    });
            })
            ->with(['dashboardCharts.chart']) //Usa la relación correcta: dashboardCharts
            ->get();
    }

    public function create(array $data): Dashboard
    {
        //Obtener el ID del usuario autenticado
        $userId = Auth::id();
        if (!$userId) {
            Log::error('Intento de crear tablero sin usuario autenticado');
            throw new \Exception('No hay usuario autenticado');
        }

        $data['program_id'] = $this->getProgramIdFromSlug($data['_program_slug'] ?? 'data-core');
        $data['created_by'] = $userId;
        $data['layout_config'] = $data['layout_config'] ?? null;

        $dashboard = Dashboard::create($data);

        if (!$dashboard) {
            throw new \Exception('No se pudo crear el tablero');
        }

        try {
            //Asignar el tablero al usuario actual (puede editarlo y compartirlo)
            $dashboard->users()->attach($userId, [
                'can_edit' => true,
                'can_share' => true,
                'granted_at' => now(),
            ]);
            Log::info('Tablero asignado al usuario', [
                'dashboard_id' => $dashboard->id,
                'user_id' => $userId,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al asignar tablero al usuario: ' . $e->getMessage(), [
                'dashboard_id' => $dashboard->id,
                'user_id' => $userId,
            ]);
            //No relanzamos la excepción para no interrumpir la creación, pero queda registrado
        }

        //Cargar la relación users para que el frontend pueda ver la asignación
        return $dashboard->load('users');
    }

    public function update(Dashboard $dashboard, array $data): Dashboard
    {
        $dashboard->update($data);
        return $dashboard->fresh();
    }

    public function addChart(Dashboard $dashboard, array $data): DashboardChart
    {
        $exists = $dashboard->dashboardCharts()->where('chart_id', $data['chart_id'])->exists();
        if ($exists) {
            throw new \Exception('Esta gráfica ya está en el tablero', 409);
        }
        //Usamos la relación dashboardCharts() (definida en el modelo Dashboard)
        return $dashboard->dashboardCharts()->create($data);
    }

    private function getProgramIdFromSlug(string $slug): int
    {
        return SuiteProgram::where('slug', $slug)->value('id');
    }
}
