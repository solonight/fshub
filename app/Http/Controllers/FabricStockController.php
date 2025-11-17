<?php

namespace App\Http\Controllers;

use App\Models\FabricStock;
use Illuminate\Http\Request;

class FabricStockController extends Controller
{
    // List all fabric stocks, paginated (20 per page)
    public function index(Request $request)
    {
        $stocks = FabricStock::paginate(20);
        return response()->json($stocks);
    }

    // Show a single fabric stock
    public function show($id)
    {
        return FabricStock::findOrFail($id);
    }

    // Create a new fabric stock
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fabric_type' => [
                'required',
                'string',
                'in:Cotton,Linen,Wool,Silk,Hemp,Polyester,Nylon,Acrylic,Spandex,Viscose/Rayon,Lyocell (Tencel),Denim,Jersey,Flannel,Satin'
            ],
            'stock_location' => 'nullable|string',
            'color' => 'required|string',
            'price_per_unit' => 'required|numeric',
            'total_quantity' => 'required|numeric',
            'available_quantity' => 'nullable|numeric',
            'description' => 'nullable|string',
            'auto_delete' => 'boolean',
            'samples_availability' => 'boolean',
        ]);
        $validated['user_id'] = auth()->id();
        if (!isset($validated['available_quantity'])) {
            $validated['available_quantity'] = $validated['total_quantity'];
        }
        FabricStock::create($validated);
        return redirect()->route('stock.dashboard')->with('success', 'Stock added successfully!');
    }

    // Update an existing fabric stock
    public function update(Request $request, $id)
    {
        $fabricStock = FabricStock::findOrFail($id);
        // Authorization: Only the owner can update
        if (auth()->id() !== $fabricStock->user_id) {
            return response()->json(['message' => 'Forbidden: You can only update your own stocks.'], 403);
        }
        $validated = $request->validate([
            'fabric_type' => [
                'sometimes',
                'string',
                'in:Cotton,Linen,Wool,Silk,Hemp,Polyester,Nylon,Acrylic,Spandex,Viscose/Rayon,Lyocell (Tencel),Denim,Jersey,Flannel,Satin'
            ],
            'stock_location' => 'sometimes|string',
            'color' => 'sometimes|string',
            'price_per_unit' => 'sometimes|numeric',
            'total_quantity' => 'sometimes|numeric',
            'available_quantity' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'auto_delete' => 'boolean',
            'samples_availability' => 'boolean',
        ]);
        $fabricStock->update($validated);
        return redirect()->route('stock.dashboard')->with('success', 'Stock updated successfully!');
    }

    // Delete a fabric stock
    public function destroy($id)
    {
        $fabricStock = FabricStock::findOrFail($id);
        // Authorization: Only the owner can delete
        if (auth()->id() !== $fabricStock->user_id) {
            return response()->json(['message' => 'Forbidden: You can only delete your own stocks.'], 403);
        }
        $fabricStock->delete();
        return redirect()->route('stock.dashboard')->with('success', 'Deleted successfully');
    }
}
