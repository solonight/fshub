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
        'is_payed',
        'notes',
        'sale_date',
        'returned_quantity',
        'return_date'
    ];

    protected $casts = [
        'quantity_sold' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'is_payed' => 'boolean',
        'sale_date' => 'datetime',
        'returned_quantity' => 'decimal:2',
        'return_date' => 'datetime'
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

    public function getNetQuantitySoldAttribute()
    {
        return $this->quantity_sold - $this->returned_quantity;
    }

    public function getIsFullyReturnedAttribute()
    {
        return $this->net_quantity_sold <= 0;
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

                // Only create StockHistory if the sale is payed
                if ($saleRecord->is_payed) {
                    \App\Models\StockHistory::create([
                        'stock_id' => $stock->stock_id,
                        'user_id' => $saleRecord->user_id,
                        'change_type' => 'SALE',
                        'quantity' => -$saleRecord->quantity_sold,
                        'notes' => $saleRecord->notes,
                        'reference_id' => $saleRecord->record_id,
                        'customer_name' => $saleRecord->customer_name,
                        'customer_phone' => $saleRecord->customer_phone,
                    ]);
                }

                // BEGINNER LOGIC: Auto-delete stock if needed
                // Check if auto_delete is true and available_quantity is now 0 or less
                if ($stock->shouldAutoDelete()) {
                    $stock->delete(); // This will soft-delete the stock (move to trash)
                }
            }
        });

        // When a sale record is updated, check if is_payed changed from false to true
        static::updating(function ($saleRecord) {
            // Only act if is_payed is being changed from false to true
            if ($saleRecord->isDirty('is_payed') && $saleRecord->is_payed && !$saleRecord->getOriginal('is_payed')) {
                $stock = $saleRecord->stock;
                if ($stock) {
                    \App\Models\StockHistory::create([
                        'stock_id' => $stock->stock_id,
                        'user_id' => $saleRecord->user_id,
                        'change_type' => 'SALE',
                        'quantity' => -$saleRecord->quantity_sold,
                        'notes' => $saleRecord->notes,
                        'reference_id' => $saleRecord->record_id,
                        'customer_name' => $saleRecord->customer_name,
                        'customer_phone' => $saleRecord->customer_phone,
                    ]);
                }
            }

            // Handle returned_quantity changes
            if ($saleRecord->isDirty('returned_quantity')) {
                $diff = $saleRecord->returned_quantity - $saleRecord->getOriginal('returned_quantity');
                if ($diff > 0) {
                    $stock = $saleRecord->stock;
                    if ($stock) {
                        $stock->available_quantity += $diff;
                        $stock->save();
                        $saleRecord->return_date = now();
                        \App\Models\StockHistory::create([
                            'stock_id' => $stock->stock_id,
                            'user_id' => $saleRecord->user_id,
                            'change_type' => 'RETURN',
                            'quantity' => $diff,
                            'notes' => $saleRecord->notes,
                            'reference_id' => $saleRecord->record_id,
                            'customer_name' => $saleRecord->customer_name,
                            'customer_phone' => $saleRecord->customer_phone,
                        ]);
                    }
                }
            }
        });
    }
}