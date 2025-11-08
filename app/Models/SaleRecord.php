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
        // add is payed boolean
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

    protected static function boot()
    {
        parent::boot();

        static::created(function ($saleRecord) {
            // Update available_quantity in FabricStock
            $stock = $saleRecord->stock;
            if ($stock) {
                $stock->available_quantity -= $saleRecord->quantity_sold;
                $stock->save();

                // Create StockHistory record
                \App\Models\StockHistory::create([
                    'stock_id' => $stock->stock_id,
                    'user_id' => $saleRecord->user_id,
                    'change_type' => 'SALE',
                    'quantity' => -$saleRecord->quantity_sold,
                    'notes' => $saleRecord->notes,
                    'reference_id' => $saleRecord->record_id,
                ]);
            }
        });
    }
}