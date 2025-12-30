<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\SaleRecord;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request, SaleRecord $saleRecord)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        if ($request->amount > $saleRecord->unpaid_amount) {
            return response()->json(['error' => 'Payment exceeds unpaid amount.'], 422);
        }

        $saleRecord->addPayment($request->amount, ['notes' => $request->notes]);

        return response()->json(['message' => 'Payment recorded.']);
    }

    public function index(SaleRecord $saleRecord)
    {
        return response()->json($saleRecord->payments);
    }
}
