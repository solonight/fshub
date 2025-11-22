<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(40)->create();
        // \App\Models\FabricStock::factory(30)->create();
        // \App\Models\SaleRecord::factory(75)->create();
        // \App\Models\TransporterCard::factory(10)->create();
        // \App\Models\Warehouse::factory(5)->create();
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        
        $this->call(LaratrustSeeder::class);
    }

}
