<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockHistory extends Model
{
    use HasFactory;

    protected $primaryKey = 'history_id';
    
    // Specify the table name if different from Laravel's convention
    protected $table = 'stock_histories';
    
    protected $fillable = [
        'stock_id',
        'user_id',
        'change_type',
        'quantity',
        'notes',
        'reference_id',
        'fabric_type_snapshot',
        'color_snapshot',
        'price_per_unit_snapshot',
        'is_payed'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'price_per_unit_snapshot' => 'decimal:2',
        'is_payed' => 'boolean'
    ];

    public function fabricStock()
    {
        return $this->belongsTo(FabricStock::class, 'stock_id')->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function saleRecord()
    {
        return $this->belongsTo(SaleRecord::class, 'reference_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($history) {
            // Capture snapshot data when creating history
            if ($history->stock_id) {
                $stock = FabricStock::find($history->stock_id);
                if ($stock) {
                    $history->fabric_type_snapshot = $stock->fabric_type;
                    $history->color_snapshot = $stock->color;
                    $history->price_per_unit_snapshot = $stock->price_per_unit;
                }
            }
        });
    }
}