<?php

namespace App\Http\Controllers;

use App\Models\SaleRecord;
use Illuminate\Http\Request;

class SaleRecordController extends Controller
{
    // List all sale records
    public function index()
    {
        return SaleRecord::all();
    }

    // Show a single sale record
    public function show($id)
    {
        return SaleRecord::findOrFail($id);
    }

    // Create a new sale record
    public function store(Request $request)
    {
        $validated = $request->validate([
            'stock_id' => 'required|exists:fabric_stocks,stock_id',
            'user_id' => 'required|exists:users,id',
            'customer_name' => 'required|string',
            'customer_phone' => 'nullable|string',
            'quantity_sold' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'notes' => 'nullable|string',
            'sale_date' => 'nullable|date',
        ]);
        return SaleRecord::create($validated);
    }

    // Update an existing sale record
    public function update(Request $request, $id)
    {
        $saleRecord = SaleRecord::findOrFail($id);
        $validated = $request->validate([
            'customer_name' => 'sometimes|string',
            'customer_phone' => 'sometimes|string',
            'quantity_sold' => 'sometimes|numeric',
            'total_amount' => 'sometimes|numeric',
            'notes' => 'nullable|string',
            'sale_date' => 'nullable|date',
        ]);
        $saleRecord->update($validated);
        return $saleRecord;
    }

    // Delete a sale record
    public function destroy($id)
    {
        $saleRecord = SaleRecord::findOrFail($id);
        $saleRecord->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
