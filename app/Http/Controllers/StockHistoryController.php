<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockHistory;
use Illuminate\Support\Facades\Auth;

class StockHistoryController extends Controller
{
    // Get logged-in user's stock histories grouped by stock_id
    public function userGroupedHistories(Request $request)
    {
        $userId = Auth::id();
        $histories = StockHistory::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('stock_id');
        return response()->json($histories);
    }
}
