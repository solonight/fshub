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
        'pricePerUnit',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
