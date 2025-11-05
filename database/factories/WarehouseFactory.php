<?php
namespace Database\Factories;
use App\Models\Warehouse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->company(),
            'location' => $this->faker->address(),
            'capacity' => $this->faker->randomFloat(2, 100, 10000),
        ];
    }
}
