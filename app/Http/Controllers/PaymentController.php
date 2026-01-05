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
            return redirect()->back()->withErrors(['password' => 'Invalid password.']);
        }

        if ($request->amount > $saleRecord->unpaid_amount) {
            return redirect()->back()->withErrors(['amount' => '']);
        }

        $saleRecord->addPayment($request->amount, ['notes' => $request->notes ?? '']);

        return redirect()->back();
    }

    public function index(SaleRecord $saleRecord)
    {
        return response()->json($saleRecord->payments);
    }
}
