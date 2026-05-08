<?php

namespace Database\Seeders;

use App\Models\AdminCore\Position;
use App\Models\AdminCore\Role;
use App\Models\AdminCore\SuiteProgram;
use App\Models\AdminCore\User;
use App\Models\DataCore\ChartType;
use App\Models\DataCore\ChartTypeFilter;
use App\Models\DataCore\ChartTypeRule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            $dataCore = SuiteProgram::updateOrCreate(
                ['slug' => 'data-core'],
                [
                    'name' => 'DataCore',
                    'description' => 'Panel Estadístico',
                    'version' => '0.1',
                    'is_active' => true,
                ]
            );

            $adminCore = SuiteProgram::updateOrCreate(
                ['slug' => 'admin-core'],
                [
                    'name' => 'AdminCore',
                    'description' => 'Administración de la suite',
                    'version' => '0.1',
                    'is_active' => true,
                ]
            );

            $contador = Position::firstOrCreate(['name' => 'Contador']);

            $adminDataCore = Role::updateOrCreate(
                ['name' => 'admin_data_core'],
                [
                    'label' => 'Administrador DataCore',
                    'is_global' => false,
                    'program_id' => $dataCore->id,
                ]
            );

            $userDataCore = Role::updateOrCreate(
                ['name' => 'user_data_core'],
                [
                    'label' => 'Usuario DataCore',
                    'is_global' => false,
                    'program_id' => $dataCore->id,
                ]
            );

            $adminAdminCore = Role::updateOrCreate(
                ['name' => 'admin_admin_core'],
                [
                    'label' => 'Administrador de AdminCore',
                    'is_global' => false,
                    'program_id' => $adminCore->id,
                ]
            );

            $superAdmin = Role::updateOrCreate(
                ['name' => 'super_admin'],
                [
                    'label' => 'Super Administrador Global',
                    'is_global' => true,
                    'program_id' => null,
                ]
            );

            $adminUser = User::updateOrCreate(
                ['email' => 'admin@suite.com'],
                [
                    'name' => 'Administrador',
                    'password' => Hash::make('password'),
                    'position_id' => $contador->id,
                    'status' => 'active',
                ]
            );

            $adminUser->programs()->syncWithoutDetaching([
                $dataCore->id => [
                    'role_id' => $adminDataCore->id,
                    'is_active' => true,
                    'granted_at' => now(),
                ],
                $adminCore->id => [
                    'role_id' => $adminAdminCore->id,
                    'is_active' => true,
                    'granted_at' => now(),
                ],
            ]);

            $normalUser = User::updateOrCreate(
                ['email' => 'juan@suite.com'],
                [
                    'name' => 'Juan Díaz',
                    'password' => Hash::make('password'),
                    'position_id' => $contador->id,
                    'status' => 'active',
                ]
            );

            $normalUser->programs()->syncWithoutDetaching([
                $dataCore->id => [
                    'role_id' => $userDataCore->id,
                    'is_active' => true,
                    'granted_at' => now(),
                ],
            ]);

            // ========== TIPOS DE GRÁFICO Y SUS REGLAS/FILTROS ==========

            // 1. Gráfico de barras
            $bar = ChartType::updateOrCreate(
                ['name' => 'bar'],
                [
                    'label' => 'Gráfico de barras',
                    'description' => 'Comparación de valores mediante barras verticales/horizontales',
                    'icon' => 'BarChart3',
                    'supports_multiple_series' => true,
                    'requires_category_axis' => true,
                    'requires_value_axis' => true,
                    'is_active' => true,
                ]
            );

            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $bar->id, 'rule_key' => 'min_columns'],
                ['rule_value' => '2', 'description' => 'Necesita al menos 2 columnas (categoría y valor)']
            );
            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $bar->id, 'rule_key' => 'value_column_numeric'],
                ['rule_value' => 'true', 'description' => 'La columna de valores debe ser numérica']
            );

            ChartTypeFilter::updateOrCreate(
                ['chart_type_id' => $bar->id, 'name' => 'date_range'],
                [
                    'label' => 'Rango de fechas',
                    'input_type' => 'date_range',
                    'sql_placeholder' => ':date_from, :date_to',
                    'sql_injection_mode' => 'where',
                    'is_required' => false,
                ]
            );

            // 2. Gráfico de líneas
            $line = ChartType::updateOrCreate(
                ['name' => 'line'],
                [
                    'label' => 'Gráfico de líneas',
                    'description' => 'Evolución temporal de métricas',
                    'icon' => 'LineChart',
                    'supports_multiple_series' => true,
                    'requires_category_axis' => true,
                    'requires_value_axis' => true,
                    'is_active' => true,
                ]
            );

            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $line->id, 'rule_key' => 'min_columns'],
                ['rule_value' => '2', 'description' => 'Necesita al menos 2 columnas (categoría y valor)']
            );
            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $line->id, 'rule_key' => 'value_column_numeric'],
                ['rule_value' => 'true', 'description' => 'Los valores deben ser numéricos']
            );
            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $line->id, 'rule_key' => 'has_time_category'],
                ['rule_value' => 'false', 'description' => 'La categoría debe ser temporal (opcional)']
            );

            ChartTypeFilter::updateOrCreate(
                ['chart_type_id' => $line->id, 'name' => 'date_range'],
                [
                    'label' => 'Rango de fechas',
                    'input_type' => 'date_range',
                    'sql_placeholder' => ':date_from, :date_to',
                    'sql_injection_mode' => 'where',
                    'is_required' => false,
                ]
            );

            // 3. Gráfico circular (pie)
            $pie = ChartType::updateOrCreate(
                ['name' => 'pie'],
                [
                    'label' => 'Gráfico circular',
                    'description' => 'Proporciones de categorías',
                    'icon' => 'PieChart',
                    'supports_multiple_series' => false,
                    'requires_category_axis' => true,
                    'requires_value_axis' => true,
                    'is_active' => true,
                ]
            );

            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $pie->id, 'rule_key' => 'exactly_two_columns'],
                ['rule_value' => 'true', 'description' => 'Necesita exactamente 2 columnas: categoría y valor']
            );
            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $pie->id, 'rule_key' => 'value_column_numeric'],
                ['rule_value' => 'true', 'description' => 'El valor debe ser numérico']
            );

            ChartTypeFilter::updateOrCreate(
                ['chart_type_id' => $pie->id, 'name' => 'category_filter'],
                [
                    'label' => 'Filtrar categoría',
                    'input_type' => 'select',
                    'sql_placeholder' => ':category_id',
                    'sql_injection_mode' => 'where',
                    'is_required' => false,
                    'options' => json_encode(['opcion1' => 'Opción 1']), // ejemplo
                ]
            );

            // 4. Tabla (simple)
            $table = ChartType::updateOrCreate(
                ['name' => 'table'],
                [
                    'label' => 'Tabla',
                    'description' => 'Datos en formato tabular',
                    'icon' => 'Table',
                    'supports_multiple_series' => false,
                    'requires_category_axis' => false,
                    'requires_value_axis' => false,
                    'is_active' => true,
                ]
            );

            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $table->id, 'rule_key' => 'min_columns'],
                ['rule_value' => '1', 'description' => 'Al menos una columna']
            );

            // 5. Indicador KPI
            $kpi = ChartType::updateOrCreate(
                ['name' => 'kpi'],
                [
                    'label' => 'Indicador KPI',
                    'description' => 'Valor único con variación',
                    'icon' => 'Gauge',
                    'supports_multiple_series' => false,
                    'requires_category_axis' => false,
                    'requires_value_axis' => true,
                    'is_active' => true,
                ]
            );

            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $kpi->id, 'rule_key' => 'exactly_one_column'],
                ['rule_value' => 'true', 'description' => 'Debe devolver una sola fila con una columna numérica']
            );
            ChartTypeRule::updateOrCreate(
                ['chart_type_id' => $kpi->id, 'rule_key' => 'value_column_numeric'],
                ['rule_value' => 'true', 'description' => 'El valor debe ser numérico']
            );
        });
    }
}
