<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleRecord extends Model
{
    use HasFactory;

    protected $primaryKey = 'record_id';
    
    protected $fillable = [
        'stock_id',
        'user_id',
        'customer_name',
        'customer_phone',
        'quantity_sold',
        'total_amount',
        'notes',
        'sale_date'
    ];

    protected $casts = [
        'quantity_sold' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'sale_date' => 'datetime'
    ];

    public function stock()
    {
        return $this->belongsTo(FabricStock::class, 'stock_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function stockHistories()
    {
        return $this->hasMany(StockHistory::class, 'reference_id');
    }
}