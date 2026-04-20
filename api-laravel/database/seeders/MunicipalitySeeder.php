<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Municipality;
use Illuminate\Database\Seeder;

class MunicipalitySeeder extends Seeder
{
    public function run(): void
    {
        // Algunos municipios de ejemplo (puedes agregar más según necesites)
        $municipalities = [
            // Antioquia (05)
            ['department_code' => '05', 'code' => '05001', 'name' => 'Medellín'],
            ['department_code' => '05', 'code' => '05002', 'name' => 'Abejorral'],
            ['department_code' => '05', 'code' => '05004', 'name' => 'Abriaquí'],
            ['department_code' => '05', 'code' => '05021', 'name' => 'Alejandría'],
            ['department_code' => '05', 'code' => '05030', 'name' => 'Amagá'],
            ['department_code' => '05', 'code' => '05079', 'name' => 'Bello'],
            ['department_code' => '05', 'code' => '05088', 'name' => 'Belmira'],
            ['department_code' => '05', 'code' => '05107', 'name' => 'Caldas'],
            ['department_code' => '05', 'code' => '05129', 'name' => 'Caucasia'],
            ['department_code' => '05', 'code' => '05266', 'name' => 'Envigado'],
            ['department_code' => '05', 'code' => '05360', 'name' => 'Itagüí'],
 ['department_code' => '05', 'code' => '05631', 'name' => 'Rionegro'],
            ['department_code' => '05', 'code' => '05615', 'name' => 'El Retiro'],
            
            // Bogotá D.C. (11)
            ['department_code' => '11', 'code' => '11001', 'name' => 'Bogotá D.C.'],
            
            // Cundinamarca (25)
            ['department_code' => '25', 'code' => '25001', 'name' => 'Agua de Dios'],
            ['department_code' => '25', 'code' => '25019', 'name' => 'Albán'],
            ['department_code' => '25', 'code' => '25035', 'name' => 'Anapoima'],
            ['department_code' => '25', 'code' => '25040', 'name' => 'Anolaima'],
            ['department_code' => '25', 'code' => '25053', 'name' => 'Arbeláez'],
            ['department_code' => '25', 'code' => '25086', 'name' => 'Cajicá'],
            ['department_code' => '25', 'code' => '25099', 'name' => 'Caparrapí'],
            ['department_code' => '25', 'code' => '25120', 'name' => 'Chía'],
            ['department_code' => '25', 'code' => '25148', 'name' => 'Facatativá'],
            ['department_code' => '25', 'code' => '25175', 'name' => 'Funza'],
            ['department_code' => '25', 'code' => '25214', 'name' => 'Fusagasugá'],
            ['department_code' => '25', 'code' => '25224', 'name' => 'Gachancipá'],
            ['department_code' => '25', 'code' => '25258', 'name' => 'Girardot'],
            ['department_code' => '25', 'code' => '25269', 'name' => 'Granada'],
            ['department_code' => '25', 'code' => '25307', 'name' => 'La Calera'],
            ['department_code' => '25', 'code' => '25312', 'name' => 'La Mesa'],
            ['department_code' => '25', 'code' => '25326', 'name' => 'La Vega'],
            ['department_code' => '25', 'code' => '25430', 'name' => 'Madrid'],
            ['department_code' => '25', 'code' => '25473', 'name' => 'Mosquera'],
            ['department_code' => '25', 'code' => '25594', 'name' => 'Soacha'],
            ['department_code' => '25', 'code' => '25596', 'name' => 'Sopó'],
            ['department_code' => '25', 'code' => '25599', 'name' => 'Subachoque'],
            ['department_code' => '25', 'code' => '25612', 'name' => 'Tabio'],
            ['department_code' => '25', 'code' => '25645', 'name' => 'Tocancipá'],
            ['department_code' => '25', 'code' => '25658', 'name' => 'Ubaté'],
            ['department_code' => '25', 'code' => '25797', 'name' => 'Zipaquirá'],
            
            // Valle del Cauca (76)
            ['department_code' => '76', 'code' => '76001', 'name' => 'Cali'],
            ['department_code' => '76', 'code' => '76020', 'name' => 'Alcalá'],
            ['department_code' => '76', 'code' => '76036', 'name' => 'Andalucía'],
            ['department_code' => '76', 'code' => '76100', 'name' => 'Buenaventura'],
            ['department_code' => '76', 'code' => '76111', 'name' => 'Guadalajara de Buga'],
            ['department_code' => '76', 'code' => '76126', 'name' => 'Cartago'],
            ['department_code' => '76', 'code' => '76147', 'name' => 'Dagua'],
            ['department_code' => '76', 'code' => '76306', 'name' => 'Jamundí'],
            ['department_code' => '76', 'code' => '76364', 'name' => 'Palmira'],
            ['department_code' => '76', 'code' => '76520', 'name' => 'Pradera'],
            ['department_code' => '76', 'code' => '76892', 'name' => 'Yumbo'],
            
            // Atlántico (08)
            ['department_code' => '08', 'code' => '08001', 'name' => 'Barranquilla'],
            ['department_code' => '08', 'code' => '08078', 'name' => 'Baranoa'],
            ['department_code' => '08', 'code' => '08137', 'name' => 'Campo de la Cruz'],
            ['department_code' => '08', 'code' => '08296', 'name' => 'Galapa'],
            ['department_code' => '08', 'code' => '08421', 'name' => 'Malambo'],
            ['department_code' => '08', 'code' => '08433', 'name' => 'Manatí'],
            ['department_code' => '08', 'code' => '08606', 'name' => 'Sabanalarga'],
            ['department_code' => '08', 'code' => '08758', 'name' => 'Soledad'],
        ];

        foreach ($municipalities as $municipalityData) {
            $department = Department::where('code', $municipalityData['department_code'])->first();
            
            if ($department) {
                Municipality::create([
                    'department_id' => $department->id,
                    'code' => $municipalityData['code'],
                    'name' => $municipalityData['name'],
                ]);
            }
        }
    }
}