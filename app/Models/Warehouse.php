<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $table = 'warehouses';

    protected $fillable = [
        'warehouseName',
        'location',
        'totalCapacity',
        'availableCapacity',
        'rental_price_per_day',
        'user_id',
        'is_available_for_rent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
