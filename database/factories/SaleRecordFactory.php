<?php
namespace Database\Factories;
use App\Models\SaleRecord;
use App\Models\FabricStock;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
class SaleRecordFactory extends Factory
{
    protected $model = SaleRecord::class;
    public function definition()
    {
        return [
            'stock_id' => FabricStock::factory(),
            'user_id' => User::factory(),
            'customer_name' => $this->faker->name(),
            'customer_phone' => $this->faker->phoneNumber(),
            'quantity_sold' => $this->faker->randomFloat(2, 1, 20),
            'total_amount' => $this->faker->randomFloat(2, 20, 500),
            'notes' => $this->faker->sentence(),
            'sale_date' => $this->faker->date(),
        ];
    }
}
