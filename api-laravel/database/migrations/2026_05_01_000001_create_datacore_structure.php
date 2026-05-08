<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        //── 1. Tipos de gráfico ───────────────────────────────────────
        //Catálogo de tipos disponibles: bar, line, pie, table, kpi, etc.
        Schema::create('dc_chart_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();          //'bar', 'line', 'pie'
            $table->string('label', 150);                   //'Gráfico de barras'
            $table->text('description')->nullable();
            $table->string('icon', 100)->nullable();        //nombre del icono lucide
            $table->boolean('supports_multiple_series')     //¿soporta múltiples series?
                ->default(false);
            $table->boolean('requires_category_axis')       //¿necesita eje X categórico?
                ->default(true);
            $table->boolean('requires_value_axis')          //¿necesita eje Y numérico?
                ->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        //── 2. Reglas de validación por tipo de gráfico ──────────────
        //Cada regla define una restricción estructural que debe cumplir
        //la consulta SQL para ser válida con ese tipo de gráfico.
        Schema::create('dc_chart_type_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chart_type_id')
                ->constrained('dc_chart_types')
                ->cascadeOnDelete();
            $table->string('rule_key', 100);                //'min_columns', 'column_type_1'
            $table->string('rule_value', 255);              //'2', 'numeric'
            $table->string('description')->nullable();
            $table->timestamps();

            $table->unique(['chart_type_id', 'rule_key']);
            $table->index('chart_type_id');
        });

        //── 3. Definición de filtros por tipo de gráfico ─────────────
        //Define qué filtros soporta cada tipo de gráfico y cómo
        //se insertan en la consulta SQL principal.
        Schema::create('dc_chart_type_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chart_type_id')
                ->constrained('dc_chart_types')
                ->cascadeOnDelete();
            $table->string('name', 100);                    //'date_range', 'category'
            $table->string('label', 150);                   //'Rango de fechas'
            $table->enum('input_type', [                    //tipo de control UI
                'date',
                'date_range',
                'select',
                'multiselect',
                'text',
                'number',
                'boolean',
            ])->default('text');
            $table->string('sql_placeholder', 100);         //':date_from', ':category_id'
            $table->string('sql_injection_mode', 50)        //'where', 'having', 'param'
                ->default('where');
            $table->boolean('is_required')->default(false);
            $table->text('default_value')->nullable();
            $table->json('options')->nullable();            //opciones para select
            $table->timestamps();

            $table->unique(['chart_type_id', 'name']);
            $table->index('chart_type_id');
        });

        //── 4. Gráficas ───────────────────────────────────────────────
        //Cada gráfica es una consulta SQL configurada para un tipo de gráfico.
        Schema::create('dc_charts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')
                ->constrained('suite_programs')
                ->cascadeOnDelete();
            $table->foreignId('chart_type_id')
                ->constrained('dc_chart_types')
                ->restrictOnDelete();
            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();
            $table->string('name', 200);                    //título de la gráfica
            $table->text('description')->nullable();
            $table->text('sql_query');                      //consulta SQL principal
            $table->string('x_axis_column')->nullable();    //columna para eje X
            $table->string('y_axis_column')->nullable();    //columna para eje Y
            $table->string('series_column')->nullable();    //columna para series
            $table->string('label_column')->nullable();     //columna para etiquetas
            $table->json('style_config')->nullable();       //colores, tamaños, etc.
            $table->json('extra_config')->nullable();       //config adicional libre
            $table->enum('status', [
                'draft',        //en construcción
                'validated',    //SQL validado correctamente
                'published',    //disponible para tableros
                'deprecated',   //ya no se usa
            ])->default('draft');
            $table->boolean('is_public')->default(false);   //visible para todos
            $table->timestamps();
            $table->softDeletes();

            $table->index(['program_id', 'status']);
            $table->index('chart_type_id');
            $table->index('created_by');
        });

        //── 5. Filtros configurados por gráfica ───────────────────────
        //Instancia de un filtro de tipo en una gráfica concreta,
        //con su valor por defecto y configuración específica.
        Schema::create('dc_chart_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chart_id')
                ->constrained('dc_charts')
                ->cascadeOnDelete();
            $table->foreignId('chart_type_filter_id')
                ->constrained('dc_chart_type_filters')
                ->restrictOnDelete();
            $table->text('default_value')->nullable();
            $table->boolean('is_visible')->default(true);   //mostrar al usuario final
            $table->boolean('is_required')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['chart_id', 'chart_type_filter_id']);
            $table->index('chart_id');
        });

        //── 6. Parámetros dinámicos de la gráfica ────────────────────
        //Variables adicionales que se inyectan en el SQL
        //y no corresponden a filtros tipados del tipo de gráfico.
        Schema::create('dc_chart_parameters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chart_id')
                ->constrained('dc_charts')
                ->cascadeOnDelete();
            $table->string('key', 100);                     //nombre del parámetro
            $table->string('label', 150);
            $table->enum('type', [
                'string',
                'integer',
                'decimal',
                'boolean',
                'date',
            ])->default('string');
            $table->text('default_value')->nullable();
            $table->boolean('is_required')->default(false);
            $table->timestamps();

            $table->unique(['chart_id', 'key']);
            $table->index('chart_id');
        });

        //── 7. Tableros ───────────────────────────────────────────────
        Schema::create('dc_dashboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')
                ->constrained('suite_programs')
                ->cascadeOnDelete();
            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->json('layout_config')->nullable();      //posición de gráficas en grid
            $table->enum('status', [
                'draft',
                'published',
                'archived',
            ])->default('draft');
            $table->boolean('is_public')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['program_id', 'status']);
            $table->index('created_by');
        });

        //── 8. Gráficas dentro de un tablero ─────────────────────────
        Schema::create('dc_dashboard_charts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dashboard_id')
                ->constrained('dc_dashboards')
                ->cascadeOnDelete();
            $table->foreignId('chart_id')
                ->constrained('dc_charts')
                ->restrictOnDelete();
            $table->integer('position_x')->default(0);     //columna en el grid
            $table->integer('position_y')->default(0);     //fila en el grid
            $table->integer('width')->default(6);          //ancho en columnas (12 max)
            $table->integer('height')->default(4);         //alto en filas
            $table->integer('sort_order')->default(0);
            $table->json('override_config')->nullable();   //sobreescribe config de la gráfica
            $table->timestamps();

            $table->unique(['dashboard_id', 'chart_id']);
            $table->index('dashboard_id');
            $table->index('chart_id');
        });

        //── 9. Filtros globales del tablero ───────────────────────────
        //Filtros que aplican a múltiples gráficas del tablero.
        //Solo pueden existir si todas las gráficas del tablero
        //tienen ese filtro configurado (validado en código).
        Schema::create('dc_dashboard_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dashboard_id')
                ->constrained('dc_dashboards')
                ->cascadeOnDelete();
            $table->foreignId('chart_type_filter_id')
                ->constrained('dc_chart_type_filters')
                ->restrictOnDelete();
            $table->text('default_value')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['dashboard_id', 'chart_type_filter_id']);
            $table->index('dashboard_id');
        });

        //── 10. Asignación de tableros a usuarios ─────────────────────
        Schema::create('dc_dashboard_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dashboard_id')
                ->constrained('dc_dashboards')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->boolean('can_edit')->default(false);   //¿puede editar el tablero?
            $table->boolean('can_share')->default(false);  //¿puede compartirlo?
            $table->timestamp('granted_at')->nullable();
            $table->timestamp('expires_at')->nullable();   //acceso temporal
            $table->timestamps();

            $table->unique(['dashboard_id', 'user_id']);
            $table->index(['dashboard_id', 'user_id']);
        });

        //── 11. Asignación de tableros a grupos ───────────────────────
        Schema::create('dc_dashboard_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dashboard_id')
                ->constrained('dc_dashboards')
                ->cascadeOnDelete();
            $table->foreignId('group_id')
                ->constrained('groups')
                ->cascadeOnDelete();
            $table->boolean('can_edit')->default(false);
            $table->boolean('can_share')->default(false);
            $table->timestamp('granted_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['dashboard_id', 'group_id']);
            $table->index(['dashboard_id', 'group_id']);
        });

        //── 12. Log de ejecuciones de gráficas ───────────────────────
        //Auditoría de cada vez que un usuario ejecuta una gráfica.
        //Útil para detectar queries lentas y optimizar.
        Schema::create('dc_chart_execution_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chart_id')
                ->constrained('dc_charts')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('dashboard_id')
                ->nullable()
                ->constrained('dc_dashboards')
                ->nullOnDelete();
            $table->json('applied_filters')->nullable();   //filtros usados en esa ejecución
            $table->integer('execution_time_ms')->nullable(); //tiempo en ms
            $table->integer('rows_returned')->nullable();
            $table->enum('status', ['success', 'error'])->default('success');
            $table->text('error_message')->nullable();
            $table->timestamp('executed_at');
            $table->timestamps();

            $table->index(['chart_id', 'executed_at']);
            $table->index(['user_id', 'executed_at']);
            $table->index('dashboard_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dc_chart_execution_logs');
        Schema::dropIfExists('dc_dashboard_groups');
        Schema::dropIfExists('dc_dashboard_users');
        Schema::dropIfExists('dc_dashboard_filters');
        Schema::dropIfExists('dc_dashboard_charts');
        Schema::dropIfExists('dc_dashboards');
        Schema::dropIfExists('dc_chart_parameters');
        Schema::dropIfExists('dc_chart_filters');
        Schema::dropIfExists('dc_charts');
        Schema::dropIfExists('dc_chart_type_filters');
        Schema::dropIfExists('dc_chart_type_rules');
        Schema::dropIfExists('dc_chart_types');
    }
};
