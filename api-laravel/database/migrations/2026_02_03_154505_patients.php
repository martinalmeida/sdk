<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('document_type_id')
                  ->constrained('document_types')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            
            $table->string('document_number', 20)->unique();
            $table->string('first_name', 100);
            $table->string('second_name', 100)->nullable();
            $table->string('first_surname', 100);
            $table->string('second_surname', 100)->nullable();
            
            $table->foreignId('gender_id')
                  ->constrained('genders')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            
            $table->foreignId('department_id')
                  ->constrained('departments')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            
            $table->foreignId('municipality_id')
                  ->constrained('municipalities')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            
            $table->string('email')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};