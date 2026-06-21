<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_record_id',
        'amount',
        'payment_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function saleRecord(): BelongsTo
    {
        return $this->belongsTo(SaleRecord::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($payment) {
            $sale = $payment->saleRecord;
            if ($sale) {
                $stock = $sale->stock;
                \App\Models\StockHistory::create([
                    'stock_id' => $stock?->stock_id,
                    'user_id' => $sale->user_id,
                    'change_type' => 'PAYMENT',
                    'quantity' => 0,
                    'notes' => 'Payment received: ' . (string) $payment->amount,
                    'reference_id' => $sale->record_id,
                    'customer_name' => $sale->customer_name,
                    'customer_phone' => $sale->customer_phone,
                    'is_payed' => $sale->is_payed,
                ]);
            }
        });
    }
}
