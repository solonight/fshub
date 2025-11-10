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
            // 'user_id' => 'required|exists:users,id', // will be set automatically
            'customer_name' => 'required|string',
            'customer_phone' => 'nullable|string',
            'quantity_sold' => 'required|numeric|min:0.01',
            'total_amount' => 'required|numeric',
            'is_payed' => 'boolean',
            'notes' => 'nullable|string',
            'sale_date' => 'nullable|date',
        ]);

        $stock = \App\Models\FabricStock::findOrFail($validated['stock_id']);
        if ($stock->available_quantity < $validated['quantity_sold']) {
            return response()->json(['message' => 'Not enough stock available'], 400);
        }

        // Set user_id: if authenticated, use their id; else use stock owner
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        } else {
            $validated['user_id'] = $stock->user_id;
        }

        $saleRecord = SaleRecord::create($validated);
        // available_quantity and StockHistory handled by SaleRecord model boot method
        return $saleRecord;
    }

    // Update an existing sale record
    public function update(Request $request, $id)
    {
        $saleRecord = SaleRecord::findOrFail($id);
        $validated = $request->validate([
            'customer_name' => 'sometimes|string',
            'customer_phone' => 'sometimes|string',
            'quantity_sold' => 'sometimes|numeric|min:0.01',
            'total_amount' => 'sometimes|numeric',
            'is_payed' => 'boolean',
            'notes' => 'nullable|string',
            'sale_date' => 'nullable|date',
        ]);

        // If is_payed is being updated, update related StockHistory
        if (array_key_exists('is_payed', $validated)) {
            \App\Models\StockHistory::where('reference_id', $saleRecord->record_id)
                ->update(['is_payed' => $validated['is_payed']]);
        }

        // If quantity_sold is being updated, adjust FabricStock available_quantity
        if (isset($validated['quantity_sold'])) {
            $stock = $saleRecord->stock;
            $diff = $validated['quantity_sold'] - $saleRecord->quantity_sold;
            if ($diff > 0 && $stock->available_quantity < $diff) {
                return response()->json(['message' => 'Not enough stock available for update'], 400);
            }
            $stock->available_quantity -= $diff;
            $stock->save();
            // Optionally, create a StockHistory for update
            \App\Models\StockHistory::create([
                'stock_id' => $stock->stock_id,
                'user_id' => $saleRecord->user_id,
                'change_type' => 'SALE_UPDATE',
                'quantity' => -$diff,
                'notes' => $validated['notes'] ?? $saleRecord->notes,
                'reference_id' => $saleRecord->record_id,
            ]);
        }

        $saleRecord->update($validated);
        return $saleRecord;
    }

    // Delete a sale record
    public function destroy($id)
    {
        $saleRecord = SaleRecord::findOrFail($id);
        $stock = $saleRecord->stock;
        // Restore available_quantity
        $stock->available_quantity += $saleRecord->quantity_sold;
        $stock->save();
        // Optionally, create a StockHistory for delete
        \App\Models\StockHistory::create([
            'stock_id' => $stock->stock_id,
            'user_id' => $saleRecord->user_id,
            'change_type' => 'SALE_DELETE',
            'quantity' => $saleRecord->quantity_sold,
            'notes' => $saleRecord->notes,
            'reference_id' => $saleRecord->record_id,
        ]);
        $saleRecord->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
