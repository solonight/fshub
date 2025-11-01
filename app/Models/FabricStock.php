<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FabricStock extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'stock_id';
    
    protected $fillable = [
        'user_id',
        'fabric_type',
        'color',
        'price_per_unit',
        'total_quantity',
        'available_quantity',
        'description',
        'auto_delete'
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
        'total_quantity' => 'decimal:2',
        'available_quantity' => 'decimal:2',
        'auto_delete' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function saleRecords()
    {
        return $this->hasMany(SaleRecord::class, 'stock_id');
    }

    public function stockHistories()
    {
        return $this->hasMany(StockHistory::class, 'stock_id');
    }

    public function shouldAutoDelete()
    {
        return $this->auto_delete && $this->available_quantity <= 0;
    }
}