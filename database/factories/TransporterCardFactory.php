<?php
namespace Database\Factories;
use App\Models\TransporterCard;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
class TransporterCardFactory extends Factory
{
    protected $model = TransporterCard::class;
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'card_number' => $this->faker->unique()->numerify('TC####'),
            'vehicle_type' => $this->faker->word(),
            'valid_until' => $this->faker->date(),
        ];
    }
}
