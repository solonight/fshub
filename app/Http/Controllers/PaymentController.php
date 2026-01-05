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
            'password' => 'required',
        ]);

        if (!\Hash::check($request->password, auth()->user()->password)) {
            return response()->json(['error' => 'Invalid password.'], 422);
        }

        if ($request->amount > $saleRecord->unpaid_amount) {
            return response()->json(['error' => 'Payment exceeds unpaid amount.'], 422);
        }

        $saleRecord->addPayment($request->amount, ['notes' => $request->notes ?? '']);

        return redirect()->back()->with('success', 'Payment recorded.');
    }

    public function index(SaleRecord $saleRecord)
    {
        return response()->json($saleRecord->payments);
    }
}
