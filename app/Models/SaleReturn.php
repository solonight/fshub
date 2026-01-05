<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_record_id',
        'returned_quantity',
        'returned_amount',
        'return_date',
        'notes'
    ];

    protected $casts = [
        'returned_quantity' => 'decimal:2',
        'returned_amount' => 'decimal:2',
        'return_date' => 'datetime'
    ];

    public function saleRecord()
    {
        return $this->belongsTo(SaleRecord::class, 'sale_record_id', 'record_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($return) {
            $saleRecord = $return->saleRecord;
            $stock = $saleRecord->stock;

            if ($stock) {
                // Adjust stock availability
                $stock->available_quantity += $return->returned_quantity;
                $stock->save();

            // Adjust sale record total_amount based on payment status
            if ($saleRecord->is_payed) {
                // Fully paid: full refund
                $saleRecord->total_amount -= $return->returned_amount;
            } elseif ($saleRecord->isPartiallyPaid()) {
                // Partially paid: proportional refund
                $paidRatio = $saleRecord->total_paid / $saleRecord->total_amount;
                $refundAmount = $return->returned_amount * $paidRatio;
                $saleRecord->total_amount -= $refundAmount;
            }
            // For unpaid: no total_amount adjustment
            $saleRecord->save();

                // Log in StockHistory
                \App\Models\StockHistory::create([
                    'stock_id' => $stock->stock_id,
                    'user_id' => $saleRecord->user_id,
                    'change_type' => 'RETURN',
                    'quantity' => $return->returned_quantity,
                    'notes' => $return->notes,
                    'reference_id' => $saleRecord->record_id,
                    'customer_name' => $saleRecord->customer_name,
                    'customer_phone' => $saleRecord->customer_phone,
                    'is_payed' => $saleRecord->is_payed,
                ]);
            }
        });
    }
}