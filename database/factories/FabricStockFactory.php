<?php
namespace Database\Factories;
use App\Models\FabricStock;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
class FabricStockFactory extends Factory
{
    protected $model = FabricStock::class;
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'fabric_type' => $this->faker->word(),
            'color' => $this->faker->safeColorName(),
            'price_per_unit' => $this->faker->randomFloat(2, 10, 100),
            'total_quantity' => $this->faker->randomFloat(2, 50, 500),
            'available_quantity' => $this->faker->randomFloat(2, 50, 500),
            'description' => $this->faker->sentence(),
            'auto_delete' => $this->faker->boolean(),
            'samples_availability' => $this->faker->boolean(),
        ];
    }
}
